# Library Management System – Frontend

This is the **custom frontend** for the Library Management System coding challenge. It connects to a Frappe Framework 15 backend via REST API and allows authenticated users to manage Books, Members, and Loans through a modern, standalone web interface.

---

## Tech Stack

* **React 18**
* **Javascript**
* **Vite** (build tool)
* **Axios** (API requests)
* **Shadcn/UI** (UI components)
* **Tailwind CSS**
* **Docker** (for containerization)

---

## Features

* Custom authentication pages (Register, Login)
* Book management (list, add, edit, delete)
* Member management (list, add, edit, delete)
* Loan management (create loan, check availability)
* Reservation queue handling
* Overdue notification triggers (initiated via backend)
* Role-based UI (admin, librarian, member views)

---

## Setup Instructions (Development Mode)

### Prerequisites:

* Node.js 18+
* npm or yarn

### Installation:

```bash
git clone https://github.com/kaleabendrias/Library_Management_System
cd frontend
npm install
npm run dev
```

The app will run at:

```
http://localhost:5173
```

Make sure your backend is running on:

```
http://localhost:8000
```

And CORS is configured accordingly in your backend’s `common_site_config.json`.

---

## Docker Deployment

### Build Docker Image:

```bash
docker build -t kaleabendrias1212885/library-frontend:v1 ./frontend
```

### Push to Docker Hub:

```bash
docker push kaleabendrias1212885/library-frontend:v1
```

### Run with Docker Compose:

Make sure your `docker-compose.yml` includes something like:

```yml
frontend:
  image: kaleabendrias1212885/library-frontend:v1
  ports:
    - "5173:80"
  depends_on:
    - backend
```

Then start everything:

```bash
docker-compose up -d
```

---

## Environment Variables

If needed, configure:

* `VITE_API_BASE_URL=http://localhost:8000`

Stored in a `.env` file at the root of the frontend project.

---

## Folder Structure Overview

```bash
src/
 ├── components/      # Reusable UI components
 ├── pages/           # Route-specific components (Books, Members, Login, etc.)
 ├── hooks/           # Custom hooks (e.g., useAuth)
 ├── services/        # Axios setup and API calls
 ├── App.jsx          # Main React app
 └── main.jsx         # Vite entry point
```

---

## Notes & Trade-offs

* No use of Frappe Desk or Frappe Web templates—this is a fully independent frontend.
* Focused on functionality over pixel-perfect styling to prioritize deadline requirements.
* Axios handles all API interactions using cookies-based (sid) authentication.

---

## Contact

Created by **Kaleab Endrias**
GitHub: [https://github.com/kaleabendrias/Library_Management_System](https://github.com/kaleabendrias/Library_Management_System)
Email: **[kaleabendrias1212@gmail.com](mailto:kaleabendrias1212@gmail.com)**
