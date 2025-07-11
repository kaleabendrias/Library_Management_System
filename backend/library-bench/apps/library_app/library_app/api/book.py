import frappe
from frappe import _


@frappe.whitelist()
def list_books():
    return frappe.get_all("Book", fields=["name", "title", "author", "publish_date", "isbn"])

@frappe.whitelist()
def get_book(book_id):
    if not frappe.db.exists("Book", book_id):
        frappe.throw(_("Book not found"), title="404 Not Found")

    return frappe.get_doc("Book", book_id)

@frappe.whitelist()
def create_book(title, author, publish_date, isbn):
    if frappe.session.user == "Guest":
        frappe.throw("You must be logged in to perform this action.", title="Unauthorized")
    print(frappe.session.user)
    frappe.only_for(["Librarian", "Admin"])
    doc = frappe.get_doc({
        "doctype": "Book",
        "title": title,
        "author": author,
        "publish_date": publish_date,
        "isbn": isbn,
    }).insert()
    return {"message": "Book created", "book_id": doc.name}

@frappe.whitelist()
def update_book(book_id, title=None, author=None, publish_date=None, isbn=None):
    frappe.only_for("Librarian", "Admin")
    doc = frappe.get_doc("Book", book_id)
    if title: doc.title = title
    if author: doc.author = author
    if publish_date: doc.publish_date = publish_date
    if isbn: doc.isbn = isbn
    doc.save()
    return {"message": "Book updated"}

@frappe.whitelist()
def delete_book(book_id):
    frappe.only_for("Librarian", "Admin")
    frappe.delete_doc("Book", book_id)
    return {"message": "Book deleted"}
