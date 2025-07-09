import frappe
from frappe import _
from frappe.utils.password import update_password
from frappe.auth import LoginManager
from werkzeug.wrappers import Response


@frappe.whitelist(allow_guest=True)
def register(email=None, full_name=None, password=None, role="Member"):
    if not email or not full_name or not password:
        frappe.response["http_status_code"] = 400
        return {"error": "Missing required fields: email, full_name, or password."}

    if frappe.db.exists("User", email):
        frappe.response["http_status_code"] = 409
        return {"error": "A user with this email already exists."}

    try:
        user = frappe.get_doc({
            "doctype": "User",
            "email": email,
            "first_name": full_name,
            "enabled": 1,
            "new_password": password,
            "roles": [{"role": role}]
        })
        user.insert(ignore_permissions=True)
        frappe.db.commit()
        return {"message": "User registered successfully."}
    except Exception as e:
        frappe.response["http_status_code"] = 500
        return {"error": f"Registration failed: {str(e)}"}


@frappe.whitelist(allow_guest=True)
def login(email=None, password=None):
    if not email or not password:
        frappe.response["http_status_code"] = 400
        return {"error": "Email and password are required."}

    frappe.local.login_manager = LoginManager()
    try:
        frappe.local.login_manager.authenticate(email, password)
        frappe.local.login_manager.post_login()
        user = frappe.get_doc("User", email)
        return {
            "message": "Login successful.",
            "sid": frappe.session.sid,
            "email": email,
            "full_name": user.full_name,
            "roles": [r.role for r in user.roles]
        }
    except frappe.AuthenticationError:
        frappe.clear_messages()
        frappe.response["http_status_code"] = 401
        return {"error": "Invalid email or password."}
    except Exception as e:
        frappe.response["http_status_code"] = 500
        return {"error": f"Login failed: {str(e)}"}
