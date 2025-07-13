import frappe
from frappe import _

@frappe.whitelist()
def create_reservation(book, member, reservation_date):
    frappe.only_for(["Member", "Librarian", "Admin"])

    # Create reservation with notified = 0
    reservation = frappe.get_doc({
        "doctype": "Reservation",
        "book": book,
        "member": member,
        "reservation_date": reservation_date,
        "notified": 0
    })
    reservation.insert()

    # Get member email from User doctype
    user_doc = frappe.get_doc("User", member)

    try:
        frappe.sendmail(
            recipients=user_doc.email,
            subject="Library Reservation Confirmation",
            message=f"Hello {user_doc.full_name},<br>Your reservation for book ID: {book} is confirmed on {reservation_date}.",
        )

        # Update notified = 1 after email sent
        reservation.notified = 1
        reservation.save()
        print("Reservation email sent successfully.")

    except Exception as e:
        print(f"Failed to send email: {e}")
        frappe.log_error(f"Email sending failed: {e}", "Reservation Email Error")

    return {"message": "Reservation created", "reservation_id": reservation.name}

@frappe.whitelist()
def list_reservations(book=None, member=None):
    print("Listing reservations for book:", book, "and member:", member)
    user = frappe.session.user
    user_doc = frappe.get_doc("User", user)
    roles = [role.role for role in user_doc.roles]
    print("Roles:", roles)

    filters = {}

    # If user is Admin or Librarian: can see all, filtered or not
    if "Librarian" in roles or "Admin" in roles:
        if book:
            filters["book"] = book
        if member:
            filters["member"] = member
        return frappe.get_all("Reservation", filters=filters, fields=["name", "book", "member", "reservation_date", "notified"])

    # Else user is Member or other roles: restrict to own reservations
    else:
        # Find Library Member linked to user email
        member_docs = frappe.get_all("Library Member", filters={"email": user}, fields=["name"])
        if not member_docs:
            frappe.throw(_("Could not find Library Member for user: {0}").format(user), title="Invalid Member")
        
        member_id = member_docs[0].name

        # Always filter by this member's id regardless of passed filters
        filters["member"] = member_id

        # If book filter is provided, add it
        if book:
            filters["book"] = book

        return frappe.get_all("Reservation", filters=filters, fields=["name", "book", "member", "reservation_date", "notified"])
