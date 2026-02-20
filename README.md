# ⚡ ExpertConnect — Real-Time Expert Session Booking System

A real-time expert session booking app built with **React, Node.js, Express & MongoDB**. Features expert search/filter, live slot updates via Socket.io, double-booking prevention using atomic DB ops, booking form with validation, and booking status tracking (Pending/Confirmed/Completed).

---

## 🖥️ Screenshots

> Expert Listing · Expert Detail · Booking Form · My Bookings

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js (Vite), React Router, Axios, Socket.io Client |
| Backend | Node.js, Express.js, Socket.io |
| Database | MongoDB, Mongoose |
| Styling | Vanilla CSS (dark theme) |

---

## 📁 Project Structure

```
Internshala/
├── requirements.txt
├── backend/
│   ├── .env
│   ├── server.js
│   ├── config/db.js
│   ├── models/          # Expert.js, Booking.js
│   ├── controllers/     # expertController.js, bookingController.js
│   ├── routes/          # expertRoutes.js, bookingRoutes.js
│   └── seed/seedExperts.js
│
└── frontend/
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── index.css
        ├── api/axios.js
        ├── hooks/useSocket.js
        ├── components/  # Navbar, ExpertCard
        └── pages/       # ExpertListing, ExpertDetail, Booking, MyBookings
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js >= 18.x
- MongoDB >= 6.x (running locally)

### 1. Clone the repository
```bash
git clone https://github.com/sushantksagar14/Expert_SessionBookingSystem.git
cd Expert_SessionBookingSystem
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```env
MONGODB_URI=mongodb://localhost:27017/expert_booking
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Seed the database (run once):
```bash
node seed/seedExperts.js
```

Start the backend server:
```bash
npm run dev
```
> Server runs at `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend
npm install
npx vite
```
> App runs at `http://localhost:5173`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/experts` | List experts (search, filter, paginate) |
| GET | `/api/experts/:id` | Expert detail with time slots |
| POST | `/api/bookings` | Create a new booking |
| GET | `/api/bookings?email=` | Get bookings by email |
| PATCH | `/api/bookings/:id/status` | Update booking status |

---

## 🔑 Key Features

### ✅ Double-Booking Prevention
Atomic MongoDB `findOneAndUpdate` with `isBooked: false` condition ensures only one user can book a slot even under concurrent requests. A unique compound index `{ expertId, date, timeSlot }` adds a DB-level safety net.

### ⚡ Real-Time Slot Updates
Socket.io emits a `slotBooked` event on every booking. All connected clients instantly see the slot disabled — no page refresh needed.

### 📋 Booking Status Tracking
- **⏳ Pending** — Booking created, awaiting confirmation  
- **✅ Confirmed** — Expert confirmed the session  
- **🎓 Completed** — Session completed  

---

## 🌱 Seed Data

Running `node seed/seedExperts.js` populates the database with **12 experts** across categories:
`Technology` · `Business` · `Design` · `Marketing` · `Finance` · `Health` · `Education` · `Legal`

Each expert has time slots available for the **next 7 days** (9 slots per day).

---

## 👤 Author

**Sushant Kumar Sagar**  
Full Stack Developer Intern — Internshala Assignment  

---

## 📄 License

This project is for educational purposes only.
