import frappe
from frappe import _

@frappe.whitelist()
def create_reservation(book, member, reservation_date):
    frappe.only_for(["Member", "Librarian", "Admin"])

    doc = frappe.get_doc({
        "doctype": "Reservation",
        "book": book,
        "member": member,
        "reservation_date": reservation_date,
        "notified": 0
    }).insert()
    return {"message": "Reservation created", "reservation_id": doc.name}

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
