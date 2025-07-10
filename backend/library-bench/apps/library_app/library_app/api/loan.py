import frappe
from frappe import _

@frappe.whitelist()
def list_loans():
    return frappe.get_all("Loan", fields=["name", "book", "member", "loan_date", "return_date", "returned"])

@frappe.whitelist()
def create_loan(book, member, loan_date, return_date):
    frappe.only_for("Librarian", "Admin")

    # Check if book is already loaned and not returned
    active_loans = frappe.get_all("Loan", filters={"book": book, "returned": 0})
    if active_loans:
        frappe.throw(_("Book is already on loan"), title="Unavailable")

    doc = frappe.get_doc({
        "doctype": "Loan",
        "book": book,
        "member": member,
        "loan_date": loan_date,
        "return_date": return_date,
        "returned": 0
    }).insert()
    return {"message": "Loan created", "loan_id": doc.name}

@frappe.whitelist()
def return_loan(loan_id):
    frappe.only_for("Librarian", "Admin")
    doc = frappe.get_doc("Loan", loan_id)
    doc.returned = 1
    doc.save()
    return {"message": "Book returned"}
