import frappe
from frappe import _

@frappe.whitelist()
def create_reservation(book, member, reservation_date):
    frappe.only_for("Member", "Librarian", "Admin")

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
    filters = {}
    if book: filters["book"] = book
    if member: filters["member"] = member

    return frappe.get_all("Reservation", filters=filters, fields=["name", "book", "member", "reservation_date", "notified"])
