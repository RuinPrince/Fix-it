# Interview Preparation Guide

This guide breaks down the core concepts of the **Fix It** project to help you confidently explain your architecture, technology choices, and problem-solving skills during technical interviews.

## 1. Project Overview & Elevator Pitch
**The Pitch:**
"I built 'Fix It', a smart civic issue reporting platform. It bridges the gap between citizens and local government. Citizens can report issues like potholes or water leaks with GPS tags and images. The backend automatically routes the issue to the correct department based on category and ward. Officials use a React admin dashboard to track SLAs, view heatmaps, and chat with citizens in real-time. It's built with Node.js, MySQL, React, and Socket.IO."

## 2. Why Did You Choose This Tech Stack?

*   **Node.js & Express:** I wanted a highly asynchronous, event-driven backend capable of handling many concurrent connections, especially since I was integrating WebSockets (Socket.IO) for real-time notifications and chat.
*   **MySQL & Sequelize (SQL vs NoSQL):** A civic platform is highly relational. A complaint belongs to a citizen, a ward, a category, and a department. An official belongs to a department. Using a SQL database (MySQL) ensured ACID compliance, strict schema validation, and allowed me to use complex `JOIN`s for the analytics dashboard.
*   **React & Zustand:** React allowed me to build a modular, component-based dashboard. I chose Zustand over Redux because it provides a much simpler, boilerplate-free global state management solution that is perfect for managing the dashboard's themes, filters, and user session.
*   **Docker & Nginx:** Using Docker ensures the "it works on my machine" problem is eliminated. Nginx was placed in front of the Node app to act as a reverse proxy, handle WebSocket upgrades, and serve the built React static files efficiently.

## 3. Key Challenges & How You Solved Them

### Challenge 1: Handling Complex Relational Queries for Analytics
*   **Problem:** The dashboard required stats like "Resolution Rate per Department" and "Complaints by Category". Running loops in Node.js would be highly inefficient.
*   **Solution:** I utilized Sequelize's aggregation functions (`fn`, `col`) to push the computation down to the database level using SQL `GROUP BY`. This ensured the database did the heavy lifting, returning only the final aggregated numbers to the API.

### Challenge 2: Real-time Updates & State Synchronization
*   **Problem:** When an official updates a complaint status, the citizen needs to know immediately, and the admin dashboard needs to reflect the new numbers without refreshing.
*   **Solution:** I integrated Socket.IO. When a status update API is hit, the controller updates the DB and immediately emits a specific event (e.g., `STATUS_CHANGE`) to the specific user's room.

### Challenge 3: Security & Access Control
*   **Problem:** Citizens should only see their complaints. Officials should see complaints for their department. Admins should see everything.
*   **Solution:** I implemented a custom RBAC (Role-Based Access Control) middleware. It checks the `req.user.role` attached by the JWT authentication middleware. I also implemented an `isOwnerOrAdmin` middleware for specific resources.

## 4. Architectural Deep Dives to Discuss

*   **The Audit Log System:** Mention how you built a middleware that intercepts `res.json()` for all `POST/PUT/DELETE` requests. It automatically logs who made the change, the endpoint hit, and the IP address into an `AuditLog` table. This shows you think about enterprise requirements (compliance).
*   **SLA (Service Level Agreement) Tracking:** Explain how categories have an `sla_hours` field. When a complaint is created, you calculate a `resolution_eta`. The dashboard then highlights tickets that are "At Risk" or "Breached" based on the current time vs. ETA.
*   **Graceful Shutdown:** Mention how the server listens for `SIGTERM` and `SIGINT`, stops accepting new connections, and safely closes the database before exiting. This shows maturity in backend development.

## 5. Potential Future Improvements (If asked "What would you add next?")

1.  **Redis Caching:** Introduce Redis to cache the analytics data (which doesn't need to be calculated every millisecond) and the ward/category lists.
2.  **Message Queues (BullMQ):** Move email/SMS sending and AI image validation into a background worker queue so the main API thread isn't blocked.
3.  **AI Integration:** Use a Vision API (like Google Cloud Vision or Gemini) to auto-validate uploaded images to prevent citizens from uploading selfies or spam instead of actual potholes.
4.  **Microservices:** If the app scaled city-wide, split the Analytics/Reporting engine into a separate microservice from the main CRUD API.
