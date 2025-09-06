#  Food Rating App

A full-stack food rating platform built with **React, Node.js, Express, and MySQL**.  
Users can browse stores and rate them, Owners can view ratings on their stores, and Admins can manage users and stores.

---

## Features

- **Authentication**
  - Signup / Login with JWT
  - Change password (for logged-in users)
- **Roles**
  - **Admin** → Manage users and stores
  - **Owner** → View store ratings & averages
  - **User** → Browse stores, submit ratings
- **Admin Dashboard**
  - Stats: total users, stores, ratings
  - Manage Users (add new users, assign roles)
  - Manage Stores (add new stores, assign owners)
- **User Dashboard**
  - Browse & search stores
  - Submit ratings (1–5)
- **Owner Dashboard**
  - View all ratings left by users on their stores
- **Validation**
  - Both frontend and backend validation on forms (name, email, password rules, etc.)
- **Notifications**
  - Toasts for login, signup, and password updates

---

## Tech Stack

### Frontend
- React (Vite)
- TailwindCSS
- React Router DOM
- Axios
- React Toastify

### Backend
- Node.js
- Express.js
- MySQL with Sequelize ORM
- JWT Authentication
- bcrypt for password hashing

---
### 1. Clone repo
```bash
git clone https://github.com/sagar2007S/Food_Rating_App.git
cd food-rating-app
```
### 2. Install dependencies:

Backend:

```bash
cd backend
npm install
```
Frontend:

```bash
cd frontend
npm install
```
```
```
### 3. Configure environment variables: create a .env file inside backend/:

DB_NAME=myNewDatabase
DB_USER=root
DB_PASS=yourpassword
DB_HOST=localhost
JWT_SECRET=supersecretjwtkey
PORT=5000

```
```
### Running The App

Start backend:

```bash
cd backend
npm run dev
```
Start frontend:

```bash
cd frontend
npm run dev
```
```
```
### Seeding Admin

```bash
cd backend
npm run seed
```
This will Create:
email:admin@roxiller.com
password:Admin@123
role:admin
Use these credentials to log in and access the Admin Dashboard.


```
```
### API Endpoints

# Auth

POST /api/auth/signup → Signup new user

POST /api/auth/login → Login

POST /api/auth/change-password → Change password (requires auth)

# Admin

GET /api/admin/stats → Get dashboard stats

GET /api/admin/users → List users

POST /api/admin/users → Create user

GET /api/admin/stores → List stores

POST /api/admin/stores → Create store

# User

GET /api/stores → Browse all stores

POST /api/stores/:id/rate → Rate a store

# Owner

GET /api/owner/ratings → Get ratings for owned store


👨‍💻 Author

Built by Sagar Baryekar