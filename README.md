# Fix It — Smart Civic Issue Reporting & Resolution Platform 🏙️🔧

[![Node.js](https://img.shields.io/badge/Node.js-20-green?logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-Fast-blue?logo=express)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange?logo=mysql)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)](https://www.docker.com/)

**Fix It** is a production-grade, full-stack civic issue reporting platform designed to connect citizens with their local government for faster, smarter issue resolution. 

It features:
1. **Citizen Mobile App (Flutter)**: For citizens to easily report and track issues.
2. **Admin Web Dashboard (React)**: For government officials and admins to track, assign, and resolve issues.
3. **Backend API (Node.js)**: A robust REST API powering both the mobile app and the web dashboard.

## 🔴 Live Demos

* **Admin Dashboard (Vercel)**: [https://fix-it-mqd4.vercel.app](https://fix-it-mqd4.vercel.app) (Login: `admin@fixit.gov.in` / `password123`)
* **Backend API (Vercel)**: [https://fix-it-pi.vercel.app](https://fix-it-pi.vercel.app)
## 🚀 Key Features

### For Citizens
* **Easy Reporting**: Report potholes, water leaks, garbage dumps, and more with exact GPS coordinates.
* **Multimedia Uploads**: Upload up to 5 images per complaint (with planned AI validation).
* **Real-time Tracking**: Track the status of your complaints with real-time updates via Socket.IO.
* **Gamification**: Earn reputation badges (e.g., "Active Citizen", "City Guardian") for contributing to civic improvement.
* **Direct Communication**: Chat directly with assigned officials for specific complaints.

### For Officials & Admins (Dashboard)
* **Interactive Map**: View all complaints on a city map with heatmap overlays for critical issues.
* **Smart Assignment**: Auto-assignment based on complaint category and ward.
* **Analytics & SLA Tracking**: Comprehensive dashboard showing resolution rates, SLA breaches, and departmental performance.
* **Bulk Actions**: Bulk assign, escalate, or update the status of multiple complaints.
* **Role-Based Access**: Granular control for Super Admins, Admins, and Department Officials.

## 🛠️ Technology Stack

* **Backend**: Node.js, Express.js
* **Database**: SQLite (via Sequelize ORM on Vercel), Redis (Caching/Queues - optional)
* **Frontend Dashboard**: React 18, Vite, Zustand (State Management), Recharts (Analytics), React-Leaflet (Maps)
* **Authentication**: JWT (JSON Web Tokens) with Access/Refresh strategy
* **Real-time**: Socket.IO for live notifications and chat
* **DevOps**: Docker, Docker Compose, Nginx (Reverse Proxy)

## 🏗️ Project Architecture

The platform uses a monolithic API architecture designed for horizontal scalability, separating concerns into Controllers, Services, and Models.
See the [Architecture Documentation](docs/ARCHITECTURE.md) for detailed Mermaid diagrams.

## 🚦 Getting Started

### Prerequisites
* Node.js v18 or v20
* MySQL 8.0+
* Docker & Docker Compose (optional, for containerized setup)

### Local Setup (Without Docker)

1. **Clone the repository & setup environment:**
   ```bash
   cp .env.example .env
   cp .env.example backend/.env
   ```
   *Edit the `.env` files to match your local MySQL credentials.*

2. **Install dependencies:**
   ```bash
   make setup
   # OR manually:
   # cd backend && npm install
   # cd admin-dashboard && npm install
   ```

3. **Seed the database (Demo Data):**
   ```bash
   make seed
   ```
   *This creates departments, wards, users, and 50 realistic demo complaints.*

4. **Start the servers:**
   ```bash
   make dev
   ```
   * Backend API runs on `http://localhost:5000`
   * Swagger Docs on `http://localhost:5000/api-docs`
   * React Dashboard runs on `http://localhost:5173`

### Docker Setup (Production-Ready)

To run the entire stack (MySQL, Redis, Backend, Frontend, Nginx) using Docker Compose:

```bash
make docker-up
```
* The platform will be accessible at `http://localhost` (via Nginx).
* To view logs: `make docker-logs`
* To tear down: `make docker-down`

## 🔐 Demo Credentials

After running the database seeder, you can log into the dashboard using:

| Role | Email | Password |
|------|-------|----------|
| Super Admin | `superadmin@fixit.gov.in` | `password123` |
| Admin | `admin@fixit.gov.in` | `password123` |
| Roads Official | `roads.officer@fixit.gov.in` | `password123` |

## 📚 Documentation

Detailed documentation is available in the `docs/` folder:

* [Architecture & System Design](docs/ARCHITECTURE.md)
* [Resume & Portfolio Descriptions](docs/RESUME_DESCRIPTIONS.md)
* [Interview Preparation Guide](docs/INTERVIEW_PREP.md)
* [60+ Viva & Technical Questions](docs/VIVA_QUESTIONS.md)

## 📄 License

This project is licensed under the MIT License.
