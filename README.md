# Eventlyze – Backend

A powerful backend API for Eventlyze, an event management platform that supports user authentication, event creation (online/offline), participation, payments, reviews, and admin moderation. Built with scalability and modularity in mind to handle public/private, free/paid events securely.

## 📃 Documentation

[View Documentation on Google Docs](https://docs.google.com/document/d/1f6UQgBlSqhzzRZYaLK6R0_hQVAHkPbuUWXwrNXMa3Rg/edit?usp=drive_link)

#### Server Link➡️ https://eventlyze-server.vercel.app

## 🛠 Tech Stack

- **Node.js** + **Express** – Backend Framework
- **PostgreSQL** – Relational Database
- **Prisma ORM** – Database Modeling & Querying
- **JWT** – Authentication
- **RESTful API** – Routing and Endpoint Management

## 📦 Features

- User Registration, Login & Profile Management (JWT-based)
- Role-based Access Control (Admin/User)
- Event Creation (Online & Offline)
- Join/Request/Ban/Approve Event Participants
- Payment Gateway Integration & Status Tracking
- Review System for Events
- Admin Dashboard APIs
- Optional Notifications Module

## 📁 Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/rockyhaque/eventlyze-server
```
```
cd eventlyze-server
```

### 2. Install Dependencies

```bash
npm install
```
### 3. Configure Environment
> Create a .env file in the root or to see more checkout the `.env.example` file.

```bash
DATABASE_URL="postgresql://username:password@localhost:5432/eventlyze"
```
```
PORT=5000
```

### 4. Run Prisma Migrations (Additional)
> For the starter file you don't have to follow this

```bash
npx prisma migrate dev
```
```
npx prisma generate
```

### 5. Start the Server

```bash
npm run dev
```

