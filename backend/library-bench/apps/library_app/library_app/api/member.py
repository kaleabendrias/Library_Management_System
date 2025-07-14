import frappe
from frappe import _

@frappe.whitelist()
def list_members():
    """List all library members with key fields."""
    frappe.only_for("Librarian", "Admin")
    members = frappe.get_all("Library Member", 
        fields=["name", "full_name", "email", "phone"])
    return members


import frappe
from frappe import _

@frappe.whitelist()
def delete_member(member_id):
    frappe.only_for("Librarian", "Admin")

    try:
        member = frappe.get_doc("Library Member", member_id)

        # Delete linked reservations
        reservations = frappe.get_all("Reservation", filters={"member": member.name}, pluck="name")
        for reservation_id in reservations:
            frappe.delete_doc("Reservation", reservation_id, ignore_permissions=True)

        # Delete linked user by email field on member
        user_email = getattr(member, "email", None)
        if user_email and frappe.db.exists("User", user_email):
            try:
                frappe.delete_doc("User", user_email, ignore_permissions=True)
            except frappe.LinkExistsError:
                frappe.log_error(frappe.get_traceback(), _("Failed to delete linked User"))

        # Delete the member itself
        member.delete(ignore_permissions=True)

        return {"message": _("Member, reservations, and linked user deleted successfully.")}

    except frappe.DoesNotExistError:
        frappe.throw(_("Member not found."))
    except Exception:
        print(Exception)
        frappe.log_error(frappe.get_traceback(), _("Failed to delete member"))
        frappe.throw(_("An error occurred while deleting the member."))


