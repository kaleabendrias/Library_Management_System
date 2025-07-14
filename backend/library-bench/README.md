# 📚 Library Management System – Backend

This is the backend service for the Simple Library Management System challenge. It’s built using **Frappe Framework v15**, with custom REST API endpoints to manage Books, Members, and Loans.

The frontend connects to this backend to provide a complete user experience.

---

## ✅ Features

* Custom Frappe App: `library_app`
* REST API for:

  * Books CRUD
  * Members CRUD
  * Loan management with availability checks
  * Reservation queue
* Role-based authentication (Admin, Librarian, Member)
* CORS configured for frontend access

---

## 🐋 Deployment Using Docker Compose

Instead of building the backend manually, users can pull the pre-built image from Docker Hub.

### Prerequisites

* Docker
* Docker Compose

### Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/kaleabendrias/library-management-system
   cd library-management-system
   ```

2. **Create a `.env` file (optional)**
   If environment variables are required for secrets (e.g., `MYSQL_ROOT_PASSWORD`), set them in a `.env` file.

3. **Start all services:**

   ```bash
   docker-compose up -d
   ```

4. **Access the services:**

   * Backend API:
     `http://localhost:8000/api/method/library_app.api.login`
   * Example health check:
     `http://localhost:8000/api/method/ping`

---

## 🛠️ Backend Docker Image Information

* Docker Hub:
  [`kaleabendrias1212885/library-backend:v1`](https://hub.docker.com/r/kaleabendrias1212885/library-backend)

* Example Pull Command:

  ```bash
  docker pull kaleabendrias1212885/library-backend:v1
  ```

---

## ⚙️ Notes

* **Do not use Frappe Desk.** All interactions happen through custom REST APIs and the custom frontend.
* **Volumes:**
  Data persistence for MariaDB is handled through Docker volumes defined in `docker-compose.yml`.
* **CORS:**
  Configured via `common_site_config.json`. If deploying to production, update allowed origins accordingly.

---

## 🚧 Limitations & Future Work

* No test suite included in this version.
* Email notifications are assumed to be configured externally.
