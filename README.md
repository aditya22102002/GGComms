# 🧩 GGComms Frontend

**GGComms** is a real-time communication platform featuring user-to-user messaging, a friend system, and **community servers** with both **text and voice channels**. This frontend, built with **React**, **Redux Toolkit**, **Tailwind CSS**, and **Socket.IO**, powers the dynamic and responsive user experience of the app.

This project is designed to showcase modern web development practices and provide a smooth, interactive environment for real-time collaboration and communication.

---

## 🎯 What is GGComms?

GGComms is a web-based communication platform that supports:

- Private one-on-one messaging
- A friend system with request management
- Creation and joining of **servers (communities)**
- Real-time communication via **text channels** and **voice channels**

It offers a seamless user experience for both private and community-based interactions.

---

## 💡 Key Features

### 👥 Friends & Messaging
- Register and log in securely
- Add friends using a searchable username
- Send and receive real-time private messages
- Manage incoming and outgoing friend requests
- See online/offline status

### 🏠 Servers & Channels
- Create or join **servers** (shared spaces)
- Each server can have:
  - 🗨️ Multiple **text channels**
  - 🔊 **Voice channels** for live audio chat
- Real-time updates when users join/leave channels
- Toggle between different servers and channels easily

### 📡 Real-Time Communication
- Powered by **Socket.IO**
- Real-time messaging in both private chats and text channels
- Voice channels enable real-time peer-to-peer audio
- Efficient client-side handling of socket events

### 🌈 UI/UX & Styling
- Clean, modern interface with responsive layout
- **Tailwind CSS** used for fast, utility-first design
- Organized sidebars for navigation between friends, servers, and channels

### 🔐 Authentication
- Token-based authentication with secure cookie storage
- Redirects and access control for protected pages

---

## 🛠️ Tech Stack

| Tech              | Purpose                          |
|-------------------|----------------------------------|
| React             | UI Development                   |
| Redux Toolkit     | State Management                 |
| React Router DOM  | Page Routing                     |
| Tailwind CSS      | Styling                          |
| Socket.IO Client  | Real-Time Communication          |
| Axios             | API Requests                     |
| Vite              | Fast Build & Dev Server          |

---

## 🧭 Folder Structure

