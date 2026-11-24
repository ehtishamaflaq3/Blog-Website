# DevPulse — Full-Stack MERN Blogging Platform

<p align="center">
  <strong>Share Ideas. Explore Stories. Connect Through Technology.</strong>
</p>

<p align="center">
  <a href="https://blog-website-ehtishamaflaq3.vercel.app/">
    <img src="https://img.shields.io/badge/🌐_LIVE_DEMO-Visit_DevPulse-6366f1?style=for-the-badge" alt="Live Demo" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=flat-square&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?style=flat-square&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-Framework-000000?style=flat-square&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=flat-square&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Vercel-Deployed-black?style=flat-square&logo=vercel" />
</p>

---

## About The Project

**DevPulse** is a full-stack blogging platform built using the MERN stack. It provides a space where users can create and explore blog posts, interact with content, and share their ideas.

This project was developed to gain practical experience in full-stack web development, REST APIs, authentication, database integration, and deployment.

**Live Website:** [https://blog-website-ehtishamaflaq3.vercel.app/](https://blog-website-ehtishamaflaq3.vercel.app/)

---

## Features

-  User Registration and Login
-  Create and Explore Blog Posts
-  Like and Interact with Blogs
-  Comment System
-  User Authentication
-  Dark and Light Theme
-  Blog Search Interface
-  Responsive User Interface
-  Cloud-Based Media Management
-  Live Frontend and Backend Deployment

---

## Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Redux Toolkit
- Axios
- React Router
- React Icons

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- Multer
- Cloudinary

### Tools & Deployment
- Git & GitHub
- Postman
- Vercel
- MongoDB Atlas

---

## Screenshots

### Homepage
<!-- Add your homepage screenshot here -->
<p align="center">
  <img src="screenshots/homepage.png" width="100%" alt="DevPulse Homepage" />
</p>

### Authentication
<!-- Add your login/signup screenshot here -->
<p align="center">
  <img src="screenshots/authentication.png" width="100%" alt="DevPulse Authentication" />
</p>

### Blog Details
<!-- Add your blog details screenshot here -->
<p align="center">
  <img src="screenshots/blog-details.png" width="100%" alt="DevPulse Blog Details" />
</p>

---

## Project Structure

```text
Blog-Website/
│
├── backend/
│   ├── api/
│   ├── src/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── server.js
│   ├── package.json
│   └── vercel.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   └── package.json
│
└── README.md
```

---

## Getting Started

Follow these steps to run DevPulse locally.

### 1. Clone the Repository

```bash
git clone https://github.com/ehtishamaflaq3/Blog-Website.git
```

### 2. Navigate to the Project

```bash
cd Blog-Website
```

### 3. Install Backend Dependencies

```bash
npm install --prefix backend
```

### 4. Install Frontend Dependencies

```bash
npm install --prefix frontend
```

### 5. Configure Environment Variables

Create a `.env` file inside the `backend` directory:

```env
Mongodb_Url=your_mongodb_connection_string
Secret_Key=your_jwt_secret

Cloud_Name=your_cloudinary_cloud_name
Api_Key=your_cloudinary_api_key
Api_Secret=your_cloudinary_api_secret

CLIENT_URL=http://localhost:5173
```

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

**Important:** Replace the example values with your own credentials. Never upload `.env` files or expose private API keys on GitHub.

### 6. Run the Application

Start the backend:

```bash
npm run dev --prefix backend
```

Start the frontend in another terminal:

```bash
npm run dev --prefix frontend
```

Open the local frontend URL shown by Vite in your browser.

---

## Deployment

DevPulse is deployed using Vercel and MongoDB Atlas.

| Service | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Vercel |
| Database | MongoDB Atlas |

**Live Project:** [Visit DevPulse](https://blog-website-ehtishamaflaq3.vercel.app/)

---

## Learning Outcomes

Building DevPulse helped me gain practical experience in:

- Developing a full-stack application using the MERN stack.
- Connecting React frontend with Express REST APIs.
- Working with MongoDB and Mongoose.
- Implementing user authentication and authorization.
- Managing application state with Redux.
- Handling API requests using Axios.
- Working with environment variables and deployment.
- Debugging real-world development and deployment issues.

---

## Developer

**Ehtisham Aflaq**

Software Engineering Student | MERN Stack Developer

- LinkedIn: [Ehtisham Aflaq](https://www.linkedin.com/in/ehtishamaflaq/)

---

<p align="center">
  <strong>Built with ❤️ and a lot of learning.</strong>
</p>
<p align="center">
  ⭐ If you like this project, consider giving it a star!
</p>
