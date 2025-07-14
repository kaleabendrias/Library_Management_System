import frappe
from frappe import _
from frappe.utils import nowdate
from frappe.core.doctype.communication.email import make

@frappe.whitelist()
@frappe.whitelist()
def list_loans():
    user = frappe.session.user
    user_doc = frappe.get_doc("User", user)

    roles = [role.role for role in user_doc.roles]

    # If user is Librarian or Admin, return all loans
    if "Librarian" in roles or "Admin" in roles:
        loans = frappe.get_all("Loan", fields=["name", "book", "member", "loan_date", "return_date", "returned", "status"])
    else:
        # Otherwise, user is Member, so find Library Member linked to user email
        member_docs = frappe.get_all("Library Member", filters={"email": user}, fields=["name"])
        if not member_docs:
            frappe.throw(_("Could not find Library Member for user: {0}").format(user), title="Invalid Member")
        
        member_id = member_docs[0].name
        loans = frappe.get_all("Loan", filters={"member": member_id}, fields=["name", "book", "member", "loan_date", "return_date", "returned"])

    return loans

@frappe.whitelist()
def create_loan(book, member, loan_date, return_date):
    try:
        frappe.only_for(["Librarian", "Admin", "Member"])

       # Resolve member email to Member name
        member_doc = frappe.get_all("Library Member", filters={"email": member}, fields=["name"])
        if not member_doc:
            frappe.throw(_("Could not find Member with email: {0}").format(member), title="Invalid Member")
        
        member_id = member_doc[0].name

        # Check if book is already loaned and not returned
        active_loans = frappe.get_all("Loan", filters={"book": book, "returned": 0})
        if active_loans:
            frappe.throw(_("Book is already on loan"), title="Unavailable")

        doc = frappe.get_doc({
            "doctype": "Loan",
            "book": book,
            "member": member_id,
            "loan_date": loan_date,
            "return_date": return_date,
            "returned": 0,
            "status": "Pending"
        }).insert()
        return {"message": "Loan created", "loan_id": doc.name}
    
    except Exception as e:
        frappe.response["http_status_code"] = 500
        print({"error": {str(e)}})

@frappe.whitelist()
def return_loan(loan_id):
    frappe.only_for("Librarian", "Admin")
    doc = frappe.get_doc("Loan", loan_id)
    doc.returned = 1
    doc.save()
    return {"message": "Book returned"}

@frappe.whitelist()
def list_pending_loans():
    frappe.only_for("Librarian", "Admin")
    try:
        pending_loans = frappe.get_all("Loan", filters={"status": "Pending"}, fields=["name", "book", "member", "status"])
    except Exception as e:
        print(e)
        frappe.log_error(f"Error fetching pending loans: {e}", "Pending Loans")
        frappe.response["http_status_code"] = 500
    return pending_loans

@frappe.whitelist()
def update_loan_status(loan_id, status):
    frappe.only_for("Librarian", "Admin")
    if status not in ["Approved", "Rejected"]:
        frappe.throw("Invalid status.")

    loan = frappe.get_doc("Loan", loan_id)
    loan.status = status
    loan.save(ignore_permissions=True)

    return {"message": f"Loan {status.lower()}."}


@frappe.whitelist()
def send_overdue_notifications():
    """
    Find all loans where return_date < today and returned = False,
    and send email notifications to users.
    """
    today = nowdate()
    overdue_loans = frappe.get_all(
        "Loan",
        filters={
            "return_date": ("<", today),
            "returned": 0,  # assuming 'returned' is boolean or 0/1
            "status": "Approved"
        },
        fields=["name", "member", "book", "return_date"]
    )

    for loan in overdue_loans:
        try:
            member_doc = frappe.get_doc("Library Member", loan.member)
            user_email = member_doc.email

            # Compose email subject and message
            subject = f"Overdue Book Return Reminder for '{loan.book}'"
            message = (
                f"Dear {member_doc.full_name},\n\n"
                f"Our records show that the book '{loan.book}' you borrowed "
                f"was due for return on {loan.return_date} but has not yet been returned.\n"
                "Please return the book as soon as possible to avoid penalties.\n\n"
                "Thank you,\nLibrary Team"
            )

            # Send email
            make(
                recipients=user_email,
                subject=subject,
                content=message,
                communication_type="Notification",
                doctype="Loan",
                name=loan.name,
                send_email=True,
            )
            print("message sent")
        except Exception as e:
            print(e)
            frappe.log_error(frappe.get_traceback(), f"Failed to send overdue notification for Loan {loan.name}")

    return {"message": f"Sent {len(overdue_loans)} overdue notifications."}
