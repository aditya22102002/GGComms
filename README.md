# 🧩 GGComms Frontend

**GGComms** is a real-time chat application with a clean, Discord-inspired interface. The frontend is built using **React**, **Redux Toolkit**, **Tailwind CSS**, and **Socket.IO-client**, providing a modern and responsive UI for seamless real-time communication. This project simulates the experience of a messaging platform like Discord or Slack, with user-to-user messaging and friend request management.

---

## 🎯 What is GGComms?

GGComms (short for **Good Game Communications**) is a full-stack web app designed for **real-time 1:1 messaging** between users. The **frontend** is responsible for rendering the entire user experience — from login and registration to adding friends and chatting with them live. It's a sleek, minimal, and functional messaging app made for the web.

This frontend communicates with the backend through a RESTful API and WebSocket connection, enabling instant messaging and updates.

---

## 💡 Key Features

### 👤 User Interface
- Clean, Discord-style layout with sidebars and responsive design
- Separate panels for friends, messages, and search
- Conditional rendering for login, signup, chat, and error states

### 🧠 State Management
- Global state handled via **Redux Toolkit**
- Auth, user list, friends, and messages all managed in Redux slices
- Socket events also managed through Redux for clean real-time updates

### 💬 Real-Time Messaging
- Messages appear instantly using **Socket.IO**
- Messages update live on both sender and receiver screens
- Automatic scroll-to-bottom when new messages arrive

### 🧑‍🤝‍🧑 Friend Request System
- Search users by username
- Send, accept, or decline friend requests
- Real-time UI updates when request statuses change
- Prevents duplicate requests or adding already-friended users

### 🔐 Authentication
- Login and registration via backend APIs
- JWT token management via HTTP-only cookies
- Auto-redirect based on auth status (protected routes)

### 🌈 Styling and UI/UX
- Styled with **Tailwind CSS**
- Modern, responsive design
- Minimalist theme with subtle transitions and hover effects

---

## 🛠️ Tech Stack

| Tech              | Purpose                          |
|-------------------|----------------------------------|
| React             | UI Library                       |
| Redux Toolkit     | State Management                 |
| React Router DOM  | Page Routing                     |
| Tailwind CSS      | UI Styling                       |
| Socket.IO Client  | Real-Time Communication          |
| Axios             | API Requests                     |
| Vite              | Frontend Build Tool              |

---

## 🧭 Folder Structure

