# BuzzBook - Premium Bus Booking System

A full-stack bus ticket booking application with real-time seat selection, built with React, TypeScript, Node.js, and PostgreSQL. Features production-grade concurrency handling using database transactions and row-level locking.

## 🚀 Features

- **Real-time Seat Selection**: Interactive bus layout with 2-2 seat configuration
- **Reserved Seating**: 
  - Women-reserved seats (pink color)
  - Disabled/Senior-reserved seats (amber color)
- **Secure Booking**: JWT authentication with role-based access
- **Race Condition Handling**: PostgreSQL transactions with `SELECT ... FOR UPDATE` row-level locking
- **Premium UI**: Dark mode with blue-purple-pink gradient theme
- **Responsive Design**: Works on all devices

## 🛠️ Tech Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS v4
- React Router
- Axios
- Lucide Icons
- React Hot Toast

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- bcryptjs for password hashing

## 📦 Installation

### Prerequisites
- Node.js (v16+)
- PostgreSQL (v12+)
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone git@github.com:PrashantSrivastava1104/BuzzBook.git
cd BuzzBook
```

2. **Backend Setup**
```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/bus_booking
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

Initialize database:
```bash
node src/models/init.js
```

3. **Frontend Setup**
```bash
cd ../frontend
npm install
```

## 🚀 Running the Application

### Option 1: With PostgreSQL (Production-grade)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Option 2: With Mock Backend (Quick Testing)

**Terminal 1 - Mock Backend:**
```bash
cd backend
npm run mock
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 3 - Auto-launch (Optional):**
```bash
.\start_app.bat
```

Access the app at: **http://localhost:5173/**

## 🎨 Features Showcase

### Bus Seat Layout
- **2-2 Configuration**: Realistic bus seating with aisle
- **Color-coded seats**:
  - Regular: Gray/Blue
  - Women Reserved: Pink/Rose
  - Disabled Reserved: Amber/Orange
  - Booked: Dark Gray
  - Selected: Bright gradient (matches seat type)

### User Roles
- **Regular User**: Browse trips, book seats, view bookings
- **Admin**: Create trips, manage bus schedules

## 🔒 Concurrency Control

The booking system handles race conditions using:
- PostgreSQL transactions
- Row-level locking with `SELECT ... FOR UPDATE`
- Atomic seat status updates
- Proper error handling for concurrent bookings

## 📱 Screenshots

*(Add screenshots of your application here)*

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

**Prashant Srivastava**
- GitHub: [@PrashantSrivastava1104](https://github.com/PrashantSrivastava1104)

---

**Built with ❤️ for modern travel booking**
