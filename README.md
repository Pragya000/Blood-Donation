# 🩸 Blood Donation Website

A web platform built to connect blood donors with recipients in real-time. It streamlines the process of finding eligible donors based on blood group and location and encourages voluntary blood donation across communities.

---

## 📌 Project Overview

The Blood Donation Website allows users to:
- Register as a **donor** or a **recipient**
- Search for **available donors**
- **Request blood** by sending details to potential donors
- Organize and promote **blood donation camps**
- Raise awareness and simplify the process of blood donation through a digital portal

---

## 📁 File Structure

blood-donation-website/
│├── server
│ ├── data/ # Database configuration and seed data
│ ├── middlewares/ # Authentication and error handling middleware
│ ├── model/ # Mongoose models (User, Requests, Hospitals, etc.)
│ ├── routes/ # Express route handlers (auth, requests, etc.)
│ ├── scripts/ # Custom scripts (e.g., db reset, seeding)
│ ├── utils/ # Utility functions
│ ├── .env # Environment variables
│ └── index.js # Express server entry point
├── src
│ ├── assets/ # Images and static assets
│ ├── components/ # Reusable components
│ │ ├── core/
│ │ │ ├── AdminAccount/
│ │ │ ├── Certificate/
│ │ │ ├── Feed/
│ │ │ ├── HospitalAccount/
│ │ │ ├── Request/
│ │ │ └── UserAccount/
│ ├── data/ # JSON or static data
│ ├── hooks/ # Custom React hooks
│ ├── pages/ # Page components (login, signup, profile, etc.)
│ ├── providers/ # Context Providers
│ ├── services/ # API service functions
│ └── store/ # State management (Redux or Context)
├── package.json
└── README.md

---



## Key Features
🧾 User Authentication (login/signup)

💉 Donor Registration by blood group and location

🔍 Search Donors using filters

🆘 Send Blood Requests with contact details and hospital info

📜 Track History of requests (for logged-in users)

🛠️ Admin Panel (optional: verify donors/requests)

📱 Responsive Design for all devices

🛠️ Technologies Used
HTML5 – Structure and layout
CSS3 – Styling and responsiveness
JavaScript – Interactive behaviors
Node.js + Express - Backend Server
MongoDb- Database for storing users data
Font Awesome – Icons
Google Fonts – Custom typography
Vite- Build and dev server


## 🚀 How to Start

### 1. Clone the repository
git clone https://github.com/your-username/blood-donation-website.git
cd blood-donation-website

### 2.Install Dependencies
For Backend
cd server
npm install
For Frontend
cd../
npm i
### 3. Set up env variables
Port = 5000
MONGO_URI = your_mongo_db_connection_string

### 3. Run the project
Start the development server
npm run dev
The app should now be running at http://localhost:5173/

--- 
## Screenshot
![Screenshot](./src/assets/Screenshot.png)
