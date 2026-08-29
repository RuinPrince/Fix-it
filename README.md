# Fix It — Smart Civic Issue Reporting & Resolution Platform 🏙️🔧

[![Node.js](https://img.shields.io/badge/Node.js-20-green?logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-Fast-blue?logo=express)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev/)
[![Flutter](https://img.shields.io/badge/Flutter-Mobile-blue?logo=flutter)](https://flutter.dev/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel)](https://vercel.com/)

**Fix It** is a production-grade, full-stack civic issue reporting platform designed to connect citizens with their local government for faster, smarter issue resolution. 

It features:
1. **Citizen Mobile App (Flutter)**: For citizens to easily report and track issues.
2. **Admin Web Dashboard (React)**: For government officials and admins to track, assign, and resolve issues.
3. **Backend API (Node.js)**: A robust REST API powering both the mobile app and the web dashboard.

## 🔴 Live Demos

* **Admin Dashboard (Vercel)**: [https://fix-it-mqd4.vercel.app](https://fix-it-mqd4.vercel.app) 
  * *Login:* `admin@fixit.gov.in` 
  * *Password:* `password123`
* **Backend API (Vercel)**: [https://fix-it-pi.vercel.app](https://fix-it-pi.vercel.app)

---

## 🚀 Key Features

### For Citizens (Mobile App)
* **Easy Reporting**: Report potholes, water leaks, garbage dumps, and more with exact GPS coordinates.
* **Multimedia Uploads**: Upload multiple images per complaint.
* **Real-time Tracking**: Track the status of your complaints with live updates.
* **Gamification**: Earn reputation badges (e.g., "Active Citizen") for contributing to civic improvement.

### For Officials & Admins (Web Dashboard)
* **Interactive Map**: View all complaints on a city map with heatmap overlays for critical issues.
* **Smart Assignment**: Assign tickets to different departments (Roads, Water, Sanitation).
* **Analytics & Tracking**: Comprehensive dashboard showing resolution rates and departmental performance.
* **Role-Based Access**: Granular control for Super Admins, Admins, and Department Officials.

---

## 🛠️ Technology Stack

* **Backend**: Node.js, Express.js
* **Database**: SQLite (via Sequelize ORM) — perfectly optimized for zero-config Vercel serverless deployments.
* **Frontend Dashboard**: React 18, Vite, Zustand (State Management), Tailwind / Custom CSS
* **Mobile App**: Flutter (Dart)
* **Authentication**: JWT (JSON Web Tokens)
* **Hosting**: Vercel (Serverless Functions)

---

## 🚦 Getting Started (Local Development)

Because the project is optimized for SQLite, local setup takes less than 2 minutes. No heavy Docker or MySQL installations are required!

### Prerequisites
* Node.js v18 or v20

### 1. Start the Backend API
```bash
cd backend
npm install
npm run dev
```
* The backend will automatically create a local SQLite database (`database.sqlite`) and seed the default Admin user.
* API runs on `http://localhost:5000`

### 2. Start the Admin Dashboard
Open a new terminal tab:
```bash
cd admin-dashboard
npm install
npm run dev
```
* Dashboard runs on `http://localhost:5173`

### 3. Run the Flutter Mobile App
Open a new terminal tab:
```bash
cd mobile_app
flutter pub get
flutter run
```

---

## ☁️ Deployment (Vercel)

Both the backend and frontend are pre-configured to be deployed directly to Vercel with zero configuration required.

1. **Deploy Backend**: Import the `backend` directory into a new Vercel project. Vercel will automatically read `vercel.json` and deploy it as a Serverless API with an ephemeral SQLite `/tmp` database.
2. **Deploy Dashboard**: Import the `admin-dashboard` directory into a new Vercel project. Vercel will detect Vite and build the React SPA instantly.

---

## 📚 Documentation

Detailed architectural documentation is available in the `docs/` folder:

* [Architecture & System Design](docs/ARCHITECTURE.md)
* [Resume & Portfolio Descriptions](docs/RESUME_DESCRIPTIONS.md)
* [Interview Preparation Guide](docs/INTERVIEW_PREP.md)
* [60+ Viva & Technical Questions](docs/VIVA_QUESTIONS.md)

## 📄 License
This project is licensed under the MIT License.
