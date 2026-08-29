# Resume & Portfolio Descriptions

Use these points in your resume or portfolio to highlight the impressive aspects of this project. Choose the bullets that best fit the specific role you are applying for.

## Full Stack Developer Profile

**Project: "Fix It" - Smart Civic Issue Reporting & Management Platform**
*Architected and developed a full-stack civic issue resolution platform handling real-time reporting, routing, and tracking of municipal complaints using Node.js, Express, React, and MySQL.*
* **Backend Engineering**: Designed a RESTful API in Express with Sequelize ORM, handling complex relational data (15+ tables) including Wards, Departments, Categories, and role-based access (Citizen, Official, Admin).
* **Frontend Development**: Built a premium React 18 Admin Dashboard using Vite and Zustand, featuring a responsive glassmorphic UI, real-time Recharts analytics, and an interactive Leaflet GPS map for visualizing complaint heatmaps.
* **Real-time Systems**: Implemented WebSocket communication using Socket.IO for live chat between citizens and officials, and instant status update push notifications.
* **System Design & Automation**: Built automated SLA (Service Level Agreement) tracking, severity prediction logic, and dynamic escalation workflows based on complaint categories and priority.
* **Security & Performance**: Integrated JWT-based access/refresh token authentication, Winston logging, Express rate limiting, Joi validation, and implemented a global error handler for robust API security.

## Backend Developer Profile

**Project: High-Performance Civic API Backend**
*Designed and implemented the core Node.js backend infrastructure for a city-wide complaint management system.*
* Engineered a scalable SQL schema in MySQL 8.0 using Sequelize, carefully designing complex associations, indexes, and transactions to maintain data integrity across Complaints, Departments, and Audit Logs.
* Implemented a custom Role-Based Access Control (RBAC) middleware to securely segment API access between Citizens, Officials, and Super Admins.
* Integrated Multer for multi-image uploads and optimized API response times using pagination and comprehensive request validation via Joi.
* Developed an automated Audit Logging system that transparently captures all write operations (POST/PUT/DELETE) via middleware for strict compliance and tracking.

## Frontend Developer Profile

**Project: "Fix It" React Admin Dashboard**
*Built a modern, data-rich React dashboard for municipal officials to manage city-wide infrastructure complaints.*
* Designed a stunning, premium UI with a custom CSS variable system supporting seamless Dark/Light mode switching and advanced CSS animations (glassmorphism).
* Integrated React-Leaflet to plot GPS coordinates of civic issues on an interactive OpenStreetMap layer, enabling heatmap visualization based on issue severity.
* Developed complex analytics dashboards using Recharts to visualize SLA adherence, monthly trends, and departmental resolution rates in real-time.
* Engineered a highly performant global state architecture using Zustand, minimizing re-renders while managing live socket data, auth states, and complex table filters.

## DevOps / Full Stack Profile

**Project: Containerized Civic Management Platform**
*Managed the deployment lifecycle and infrastructure configuration for a full-stack Node.js/React application.*
* Containerized the entire application stack using Docker and Docker Compose, orchestrating MySQL, Redis, Node.js API, and Nginx reverse proxy services.
* Configured Nginx as a reverse proxy to handle SSL termination, WebSocket upgrades (Socket.IO), static file serving, and API rate limiting.
* Wrote comprehensive Makefiles and database seeders to streamline local development onboarding and staging environment setups.
