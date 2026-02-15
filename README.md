# QuickVote 📊⚡

QuickVote is a real-time poll creation and sharing platform that allows users to create polls, share them using a unique Poll ID, and view live voting analytics instantly.

The platform leverages **AI assistance** to improve poll quality by generating options, refining questions, and categorizing polls — making it easy to create clear and engaging polls in seconds.

QuickVote uses **Firebase Authentication** for user management and **Firebase Database** for real-time data synchronization.

---

## 🚀 Live Demo

👉 https://quickvotepoll.vercel.app/

---

## ✨ Features

- 🗳 Create polls with a unique Poll ID
- 🔗 Share polls easily using the Poll ID
- ⚡ Real-time voting and live analytics
- 📊 Instant result updates using Firebase real-time sync
- 🔐 User authentication with Firebase
- 🧠 AI-generated poll options, question rephrasing and poll categorisation
- 🎨 Clean, responsive UI

---

## 🧠 How It Works

1. Users sign in using Firebase Authentication
2. A user creates a poll with a question
3. AI can:
   - Suggest poll options
   - Rewrite the question for better clarity
   - Automatically categorize the poll
4. A unique **Poll ID** is generated
5. Anyone with the Poll ID can vote
6. Votes are stored in Firebase Database
7. Results update in real time for all participants

---

## 🧠 AI Assistance

QuickVote integrates AI to enhance poll creation:

### 🔹 AI Option Generation
- Automatically generates relevant and balanced poll options

### 🔹 Question Refinement
- Rewrites ambiguous questions into concise, clear versions

### 🔹 Poll Categorization
- Assigns a category such as *Technology, Feedback, Opinion, Sports*, etc.

👉 AI is used only during poll creation — voting remains fast and lightweight.

---

## ⚡ Real-Time Poll Analytics

- Votes are synced instantly via Firebase Database
- Users see:
  - Live vote counts
  - Percentage distribution
  - Poll engagement updates in real time

---

## 🔐 Authentication & Data Management

### 🔹 Authentication
- Firebase Authentication
- Secure user sign-in
- Poll creation tied to authenticated users

### 🔹 Database
- Firebase Database (real-time sync)
- Polls, votes, and analytics stored securely
- Automatic updates pushed to connected clients

---

## 🛠 Tech Stack

### Frontend
- Next.js / React
- Tailwind CSS

### Backend / Services
- Firebase Authentication
- Firebase Database (real-time data)
- AI api services for poll assistance

### Deployment
- Cloud-based deployment (Vercel)

---

