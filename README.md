# Property Listing Application

A full-stack property listing platform that allows users to browse, create, update, and manage property listings. The application features secure user authentication, image uploads, and an interactive user experience built with modern web technologies.

---

## Features

* User registration and login with JWT authentication
* Create, read, update and delete property listings
* Upload property images using Cloudinary
* Responsive user interface
* Interactive 3D property viewing
* Secure backend API
* MongoDB database integration

---

## Tech Stack

### Frontend

* React 19
* TypeScript
* Vite
* Redux Toolkit
* React Router
* Axios
* Three.js
* React Three Fiber
* Drei
* Framer Motion

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Bcrypt
* Helmet
* CORS
* Morgan

### Cloud Services

* Cloudinary (Image Uploads)

---

## Project Structure

```
property-listing-app/
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── src/
│   ├── package.json
│   └── ...
│
└── README.md
```

---

## Installation

### Clone the repository

```bash
git clone <repository-url>
cd property-listing-app
```

### Install Frontend Dependencies

```bash
cd client
npm install
```

### Install Backend Dependencies

```bash
cd ../server
npm install
```

---

## Environment Variables

Create a `.env` file inside the server directory.

Example:

```env
PORT=
MONGODB_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## Running the Application

### Start the Backend

```bash
cd server
npm run dev
```

### Start the Frontend

```bash
cd client
npm run dev
```

---

## Future Improvements

* Property search and filtering
* Favorites and bookmarks
* Pagination
* Email notifications
* Admin dashboard
* Property map integration

---


