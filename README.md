# Simple Library Management System

A web application built with **Frappe Framework 15** (backend) and a fully custom frontend UI (React + TypeScript), enabling authenticated users to manage Books, Members, and Loans in a library via a secure REST API.

---

## Table of Contents

* [Purpose](#purpose)
* [Tech Stack](#tech-stack)
* [Features](#features)
* [Setup & Run](#setup--run)
* [API Endpoints](#api-endpoints)
* [User Roles & Authentication](#user-roles--authentication)
* [Architecture & Design](#architecture--design)
* [Trade-offs & Assumptions](#trade-offs--assumptions)
* [Stretch Goals](#stretch-goals)
* [Contact](#contact)

---

## Purpose

This project fulfills the coding challenge to build a library management system that lets users:

* Manage books, members, and loans via CRUD operations
* Prevent double-loaning of the same book
* Enable book reservations when unavailable
* Notify members of overdue loans by email
* Provide reports on loans and overdue books
* Authenticate users with role-based permissions
* Use a completely custom frontend UI (no Frappe Desk)
* Expose a secure REST API for external integrations

---

## Tech Stack

* **Backend:** Frappe Framework 15 (Python)
* **Frontend:** React 18 + Javascript
* **Database:** MariaDB 10.6
* **Cache:** Redis
* **Containerization:** Docker, Docker Compose
* **Other:** Gunicorn, wkhtmltopdf (for PDFs), Nginx (frontend static serving)

---

## Features

* **Book Management:** Create, read, update, and delete books with details like title, author, publish date, and ISBN.
* **Member Management:** CRUD members with name, membership ID, email, and phone.
* **Loan Handling:** Create loans, track loan and return dates, with checks to avoid double loans.
* **Reservation Queue:** Members can reserve unavailable books to borrow when returned.
* **Overdue Notifications:** Automated email reminders sent for overdue loans.
* **Authentication:** Registration, login, logout, and role-based access control (admin, librarian, member).
* **Custom Frontend:** React-based UI fully decoupled from Frappe Desk, providing intuitive and validated user interactions.
* **REST API:** Secure endpoints for all CRUD operations and integrations.

---

## Setup & Run

### Prerequisites

* Docker & Docker Compose
* Git

### Clone & Build

```bash
git clone https://github.com/kaleabendrias/Library_Management_System
cd Library_Management_System
docker-compose up --build -d
```

### Access

* Frontend UI: `http://localhost:5173`
* Backend API: `http://localhost:8000`

### Backend Site Setup (inside backend container)

```bash
docker exec -it frappe_docker_backend_1 bash
bench new-site site1.local
bench --site site1.local install-app library_app
```

Update `/home/frappe/frappe-bench/sites/common_site_config.json`:

```json
{
  "default_site": "site1.local",
  "allow_cors": "http://localhost:5173"
}
```

Restart backend:

```bash
bench restart
```

---

## API Endpoints

All APIs follow REST principles under `/api/method/library_app.api.*`

Examples:

* `GET /api/method/library_app.api.book.list_books`
* `POST /api/method/library_app.api.loan.create_loan`
* `PUT /api/method/library_app.api.member.update_member`

Authorization required via JWT tokens.

---

## User Roles & Authentication

* **Admin:** Full access
* **Librarian:** Manage books, members, loans, and reports
* **Member:** Browse books, make reservations, and view loan status

Authentication is handled via cookies sid issued on login.

---

## Architecture & Design

* Backend follows Frappe Framework conventions with custom DocTypes for Books, Members, Loans.
* Business logic enforces loan availability and reservations.
* Email reminders run as scheduled tasks.
* Frontend consumes backend REST API, avoiding any Frappe Desk usage.
* Docker used for environment consistency and ease of deployment.

---

## Trade-offs & Assumptions

* Email notification uses simple SMTP configured in backend; production would require robust queueing.
* Frontend uses React for familiarity and quick development; could be replaced by Vue/Svelte if preferred.
* No advanced UI styling beyond functional, to prioritize backend correctness and API design.

---

## Stretch Goals

* Automated CI/CD to deploy preview environments on push (planned).
* CSV export for member loan histories (planned).
* > 80% test coverage (planned).

---

## Contact

Questions or feedback? Reach out at: **[kaleabendrias1212@gmail.com](mailto:kaleabendrias1212@gmail.com)**
