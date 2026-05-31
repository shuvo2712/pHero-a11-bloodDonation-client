# 🩸 BloodLink - Blood Donation & Donor Management System

BloodLink is a comprehensive, user-friendly MERN stack (MongoDB, Express.js, React, Node.js) web application designed to bridge the gap between blood donors and individuals in urgent need of blood. By organizing real-time donation requests, secure donor search tools, and role-based administration, BloodLink streamlines the process of saving lives.

---

## 🔗 Project Links

*   **Live Web Application**: [BloodLink Live Site](https://phero-a11-blooddonation.web.app) *(or your deployed custom domain)*
*   **Client Repository**: [GitHub Client Repo](https://github.com/your-username/bloodlink-client)
*   **Server Repository**: [GitHub Server Repo](https://github.com/your-username/bloodlink-server)

---

## 🎯 Purpose & Core Objective

The primary objective of BloodLink is to facilitate immediate communication between blood seekers and potential donors. It empowers local communities by providing:
1.  A centralized hub for posting and tracking blood requests.
2.  A secure, searchable database of active blood donors filtered by blood group and geographic location.
3.  A transparent platform where volunteers and administrators coordinate requests, oversee system health, and secure organizational funding.

---

## 🌟 Key Features

### 👤 Role-Based Portals & Access Control
The application features a strict, secure dashboard layout with customized navigation bars and sidebars depending on the user's role:
*   **Admin 🌐**: Manages the complete platform. Admins can view site statistics (total users, donation requests, and funding metrics), block/unblock users, and change user roles (e.g., promoting a Donor to a Volunteer or Admin).
*   **Volunteer 🤝**: Acts as a moderator. Volunteers can view all donation requests and update their statuses (Done, Canceled, In Progress), but cannot edit or delete requests created by others.
*   **Donor 🩸 (Default)**: Can register, view public blood requests, apply to donate, create their own donation requests, edit/delete their own requests, track their requests with status filters and pagination, and search for other donors.

### 🔍 Location-Based Donor Search & PDF Export
*   Allows users to search for donors by filtering blood group, district, and upazila.
*   Displays matching donors only when a search query is submitted (protecting user data from generic scraping).
*   Allows users to download the search results as a professionally formatted PDF.

### 💳 Stripe-Integrated Funding System
*   Enables authenticated users to support the platform financially.
*   Features secure payment processing using Stripe Elements.
*   Displays a real-time table of all financial contributions.

### 🌗 Rich UX & Dark Mode
*   Features a premium, responsive interface styled with Tailwind CSS and DaisyUI.
*   Includes a global theme toggle (Light / Dark mode) with local storage memory persistence.
*   Smooth animations (powered by standard CSS transitions) and micro-interactions for buttons and forms.
*   Prefilled form fields (like email and name) that are marked as `readOnly` to preserve data integrity.

---

## 🛠️ Technology Stack & Dependencies

### Client Side (React SPA)
*   **React 19** & **Vite**: High-performance Single Page Application (SPA) development and build tooling.
*   **React Router DOM v7**: Declarative routing with protected/private routes.
*   **Firebase Authentication**: Secure client-side credentials and session management.
*   **Stripe SDK (`@stripe/react-stripe-js` & `@stripe/stripe-js`)**: Client-side credit card authorization elements.
*   **Tailwind CSS & DaisyUI**: Modern styles, components, and responsive grid layouts.
*   **React Icons**: Comprehensive collection of vector icons for dashboard indicators.
*   **React Hot Toast**: Smooth, non-blocking notification alerts.

### Server Side (Express.js API)
*   **Express.js 5**: Fast and minimalist web framework for building HTTP APIs.
*   **MongoDB Node Driver**: Robust, native asynchronous queries to MongoDB.
*   **JSON Web Tokens (`jsonwebtoken`)**: Generates and verifies signed JWT tokens to authorize secure client requests.
*   **Stripe Node SDK (`stripe`)**: Creates secure payment intents.
*   **Dotenv**: Separates sensitive keys from the source code.
*   **Cors**: Configures cross-origin security rules.

---

## 🚀 Setup & Installation Guide

Follow these steps to run BloodLink locally:

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18 or higher) and [MongoDB](https://www.mongodb.com/) installed on your machine.

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/bloodlink.git
cd bloodlink
```

### 3. Server Configuration & Setup
1.  Navigate into the `server` directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `server` root and add your credentials:
    ```env
    PORT=5000
    DB_USER=your_mongodb_username
    DB_PASS=your_mongodb_password
    ACCESS_TOKEN_SECRET=your_jwt_signing_secret
    STRIPE_SECRET_KEY=your_stripe_secret_key
    ```
4.  Start the backend server in development mode:
    ```bash
    npm run dev
    ```

### 4. Client Configuration & Setup
1.  Open a new terminal and navigate to the `client` directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env.local` file in the `client` root and add your configuration details:
    ```env
    VITE_apiKey=your_firebase_api_key
    VITE_authDomain=your_firebase_auth_domain
    VITE_projectId=your_firebase_project_id
    VITE_storageBucket=your_firebase_storage_bucket
    VITE_messagingSenderId=your_firebase_messaging_sender_id
    VITE_appId=your_firebase_app_id
    VITE_IMGBB_API_KEY=your_imgbb_api_key
    VITE_STRIPE_PK=your_stripe_publishable_key
    ```
4.  Start the client development server:
    ```bash
    npm run dev
    ```
5.  Open your browser and navigate to `http://localhost:5173`.

---

## 🔑 Admin Access Setup

To access the administrative options in the dashboard:
1.  Go to the register page in your web app and create a new account.
2.  Open your MongoDB database management tool (such as MongoDB Atlas or Compass).
3.  Select the `bloodDonationDb` database and open the `users` collection.
4.  Locate the document corresponding to your newly registered email.
5.  Change the `role` field from `"donor"` to `"admin"`.
6.  Log out and log back into the client application. Your navigation panel will now display all Admin tools.
