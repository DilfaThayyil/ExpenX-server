# 🧾 Expense Tracker API

Robust and scalable backend for the **Expense Tracker Web App** — powering user authentication, expense management, advisor scheduling, real-time communication, secure payments, and media uploads. Built with **TypeScript**, **Node.js**, **Express**, and **MongoDB**, following modular and maintainable architecture patterns.

---

## 🚀 Features

- 🔐 **JWT & Google OAuth Authentication**
- 👥 **Role-based access control** (User, Advisor, Admin)
- 📊 **Expense tracking & category filtering**
- 📅 **Advisor slot creation, updates, and booking**
- 💬 **Real-time chat** with Socket.IO
- 📹 **Video calls** powered by ZegoCloud (frontend integration)
- ☁️ **File uploads** with Cloudinary & AWS S3 using Multer
- 💳 **Stripe Integration** for secure payments
- 📩 **Email service** with Nodemailer
- 📦 **Scalable, service-repository architecture**
- 🧪 **Validation** using Joi
- ⚙️ **Environment-based configuration** for secure dev/prod usage

---

## 🧱 Tech Stack

### ⚙️ Backend
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [MongoDB + Mongoose](https://mongoosejs.com/)
- [Joi](https://joi.dev/)
- [Socket.IO](https://socket.io/)
- [Stripe](https://stripe.com/)
- [ZegoCloud UIKit](https://www.zegocloud.com/)
- [Multer](https://github.com/expressjs/multer)
- [Cloudinary](https://cloudinary.com/)
- [Nodemailer](https://nodemailer.com/)

### 🧱 Architecture
- Layered structure: **Controller → Service → Repository** (Repository architecture)
- Separation of concerns for maintainability & testing

---

## 🧪 Development

### Prerequisites

- Node.js ≥ 18
- MongoDB (local or Atlas)
- Cloudinary keys
- Stripe secret key
- Google OAuth client ID & secret

---

### 📦 Setup & Run

```bash
# Clone the repo
git clone https://github.com/DilfaThayyil/ExpenX-server.git

cd ExpenX-server

# Install dependencies
npm install

# Run the server (dev mode with nodemon)
npm run dev

