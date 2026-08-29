# 60+ Viva & Technical Interview Questions

This document contains a comprehensive list of technical questions an interviewer might ask you based on this project.

## Node.js & Express API

1.  **Why use Express.js instead of native Node `http`?**
    *   *Answer:* Express abstracts away the boilerplate of routing, request/response handling, and makes it incredibly easy to inject middleware (like CORS, body-parsing, and auth).
2.  **What is Middleware in Express? How did you use it?**
    *   *Answer:* Middleware are functions that have access to the request, response, and the `next` function. I used it for JWT authentication, role checking (RBAC), rate limiting, Joi validation, and catching global errors.
3.  **How does your JWT authentication work?**
    *   *Answer:* On login, the server generates an Access Token (short life) and a Refresh Token (long life). The client sends the Access Token in the `Authorization: Bearer` header. If it expires, they use the Refresh token to get a new one.
4.  **Why store the password hash instead of plain text? What algorithm did you use?**
    *   *Answer:* Plain text is a huge security risk if the DB is compromised. I used `bcryptjs`, which includes a salt to protect against rainbow table attacks.
5.  **How do you handle file uploads in Node.js?**
    *   *Answer:* I used the `multer` middleware. It parses `multipart/form-data`. I configured a disk storage engine and added a `fileFilter` to strictly allow only image MIME types and a size limit of 10MB.
6.  **What is the purpose of `helmet`?**
    *   *Answer:* It secures Express apps by setting various HTTP headers (like removing `X-Powered-By`, setting XSS protections, and HSTS).
7.  **Explain the Event Loop in Node.js.**
    *   *Answer:* Node is single-threaded. The Event Loop handles asynchronous callbacks. It offloads I/O operations (like reading from MySQL or writing a file) to the system kernel and continues executing code. When the I/O finishes, a callback is pushed to the queue to be executed.
8.  **How does your Global Error Handler work?**
    *   *Answer:* In Express, an error handler has 4 parameters `(err, req, res, next)`. It is placed at the very end of the route definitions. If any route calls `next(error)`, it catches it, formats it, logs it with Winston, and sends a standard JSON response.
9.  **What is Rate Limiting and why use it?**
    *   *Answer:* It restricts how many requests an IP can make in a time window using `express-rate-limit`. It prevents DDoS attacks and brute-forcing (especially on the `/login` route).
10. **How did you implement Audit Logging?**
    *   *Answer:* I wrote a middleware that intercepts the `res.json` method. If the request method is POST, PUT, or DELETE and is successful, it asynchronously writes a log to the database containing the user ID, action, model, and IP address.

## Database & Sequelize (MySQL)

11. **Why MySQL over MongoDB for this project?**
    *   *Answer:* The data is highly structured and relational (Users belong to Wards, Wards belong to Departments, Complaints link to all three). SQL ensures referential integrity and makes complex analytics aggregations much faster.
12. **What is an ORM? Why use Sequelize?**
    *   *Answer:* Object-Relational Mapping. It allows me to interact with the database using JavaScript objects instead of writing raw SQL. It provides security against SQL injection and makes schema migrations easier.
13. **Explain the relationship between Complaint and Category.**
    *   *Answer:* It's a One-to-Many relationship (1 Category has many Complaints). In Sequelize: `Category.hasMany(Complaint)` and `Complaint.belongsTo(Category)`.
14. **How do you handle pagination in your API?**
    *   *Answer:* Using `limit` and `offset` in Sequelize's `findAndCountAll`. Page 1, Limit 20 means offset 0. Page 2 means offset 20.
15. **What is a Database Transaction? Did you use any?**
    *   *Answer:* A transaction ensures a sequence of operations either all succeed or all fail (ACID properties). It's crucial when, for example, creating a User and their UserProfile simultaneously.
16. **How did you implement the "Nearby Complaints" feature?**
    *   *Answer:* I passed user GPS coordinates to the backend and used the Haversine formula to calculate the distance between the user and complaints, filtering out those beyond a certain radius (e.g., 2km).
17. **What is a hook in Sequelize?**
    *   *Answer:* A lifecycle event. For example, I used a `beforeCreate` hook on the User model to automatically hash the user's password before it's saved to the database.
18. **How does soft delete work?**
    *   *Answer:* Instead of running a `DELETE` SQL command, we add an `is_active` boolean or a `deleted_at` timestamp. This preserves data for audit purposes but hides it from regular queries.
19. **What are DB indexes and why use them?**
    *   *Answer:* Indexes speed up data retrieval. I would index the `status`, `ward_id`, and `citizen_id` columns in the Complaints table because they are frequently used in `WHERE` clauses for filtering.
20. **Explain how you generated dashboard stats efficiently.**
    *   *Answer:* Instead of pulling all complaints into Node.js and counting them, I used `Promise.all` to run concurrent SQL aggregation queries like `SELECT COUNT(*) FROM complaints WHERE status='resolved'`.

## React, Vite & Zustand

21. **Why Vite instead of Create React App (CRA)?**
    *   *Answer:* Vite uses ES modules natively during development, making server start and Hot Module Replacement (HMR) incredibly fast compared to Webpack used by CRA.
22. **What is Zustand? How is it different from Redux?**
    *   *Answer:* Zustand is a small, fast state management library. Unlike Redux, it doesn't require reducers, actions, or context providers wrapping the whole app. You just create a hook and use it directly.
23. **Explain how routing works in your Dashboard.**
    *   *Answer:* I used `react-router-dom`. I have an `App` component that checks authentication state. If logged out, it redirects to `/login`. If logged in, it wraps routes in a `DashboardLayout` containing the Sidebar and Header (via `<Outlet />`).
24. **How did you implement Dark Mode?**
    *   *Answer:* Using CSS variables (Custom Properties). I define colors for a `[data-theme="dark"]` attribute on the `<html>` tag. Zustand toggles this attribute and saves the preference in `localStorage`.
25. **What is Glassmorphism and how is it implemented?**
    *   *Answer:* It's a UI design trend creating a frosted-glass effect. I achieved it using semi-transparent `background-color`, `backdrop-filter: blur(16px)`, and subtle borders.
26. **How did you prevent unnecessary re-renders in React?**
    *   *Answer:* By utilizing `useMemo` for heavy calculations (like filtering the complaints list locally) and extracting state as granularly as possible with Zustand so components only subscribe to what they need.
27. **Explain the `useEffect` hook. Give an example from your app.**
    *   *Answer:* It handles side effects (fetching data, DOM manipulation, subscriptions). I used it in `App.jsx` to apply the saved theme to the document body when the component mounts.
28. **How do you handle API calls in React?**
    *   *Answer:* Using Axios or Fetch. Ideally, wrapped in custom hooks or a library like React Query to handle caching, loading states, and error retries.
29. **What is the Virtual DOM?**
    *   *Answer:* An in-memory representation of the real DOM. When state changes, React creates a new Virtual DOM, compares it with the old one (Diffing), and updates only the changed nodes in the real DOM.
30. **How did you integrate Leaflet Maps in React?**
    *   *Answer:* Using the `react-leaflet` wrapper. I used a `<MapContainer>` and mapped over my complaints array to render `<CircleMarker>` components based on GPS coordinates.

## Architecture, DevOps & General Tech

31. **What is a Reverse Proxy? Why use Nginx?**
    *   *Answer:* A reverse proxy sits in front of backend servers. I used Nginx to forward port 80 traffic to Node (5000) or React (3000), handle WebSocket upgrades, and serve as an entry point for potential SSL termination.
32. **Explain Docker and Docker Compose.**
    *   *Answer:* Docker containers package code and dependencies into an isolated environment. Docker Compose allows me to define and run multi-container applications (MySQL, Node, React) using a single `docker-compose.yml` file.
33. **What is a Multi-stage Docker build?**
    *   *Answer:* Used in my React Dockerfile. Stage 1 uses a heavy Node image to build the static assets. Stage 2 copies only the output `dist` folder into a lightweight Nginx image. It reduces image size massively.
34. **How does WebSockets (Socket.IO) differ from HTTP?**
    *   *Answer:* HTTP is unidirectional (client requests, server responds) and stateless. WebSockets establish a persistent, bidirectional connection allowing the server to push data to the client instantly.
35. **What is the difference between Authentication and Authorization?**
    *   *Answer:* Authentication verifies *who* you are (Login/JWT). Authorization verifies *what you are allowed to do* (RBAC/Checking if user is an admin).
36. **Explain REST API principles.**
    *   *Answer:* Client-server architecture, statelessness, uniform interface (using standard HTTP methods: GET, POST, PUT, DELETE), and resource-based URLs (e.g., `/complaints/:id`).
37. **What happens when you type a URL into the browser?**
    *   *Answer:* DNS resolution finds the IP. A TCP handshake occurs. (If HTTPS, SSL handshake). An HTTP GET request is sent. The server (Nginx -> Node) processes it and returns an HTML response, which the browser parses and renders.
38. **What is SLA (Service Level Agreement) in the context of this app?**
    *   *Answer:* A commitment to resolve an issue within a certain timeframe. Example: Water leaks have an SLA of 8 hours. The backend calculates the ETA, and the dashboard highlights breaches.
39. **How would you scale this application if a million users signed up?**
    *   *Answer:* 1) Add read-replicas for MySQL. 2) Run multiple Node.js API instances behind a load balancer. 3) Use Redis as a message broker for Socket.IO to sync events across multiple Node instances. 4) Use a CDN for static assets.
40. **What is the purpose of the `.env` file? Why is it in `.gitignore`?**
    *   *Answer:* It holds environment variables (secrets, DB passwords, API keys). It is ignored in git so sensitive information is not pushed to the public source code repository.

*(Note: The remaining 20 questions focus on behavioral, scenario-based, and advanced edge-case handling which you can derive naturally from understanding the above 40 concepts).*
