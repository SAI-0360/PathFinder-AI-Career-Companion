# 🚀 PathFinder

An AI-powered career companion that helps users explore career paths and generate structured, personalized learning roadmaps.

---

## 🌐 Live Demo

🔗 https://pathfinder-ai-career-companion.vercel.app/

---

## 📌 Overview

PathFinder is designed to solve a common problem faced by students and beginners — **lack of structured and personalized career guidance**.

Instead of jumping between random resources, users can:
- Explore career paths
- Understand requirements using AI-generated overviews
- Generate step-by-step roadmaps
- Track their learning progress

---

## ✨ Features

### 🔍 Career Exploration
- Browse predefined career paths
- "Explore Anything" feature for custom queries
- AI-generated career overviews:
  - Skills required
  - Salary insights
  - Learning timeline
  - Key milestones

---

### 🧠 AI-Powered Roadmaps
- Personalized roadmap generation
- Based on:
  - User level
  - Career goal
- Structured into phases and topics

---

### 📚 Resource Curation
- Each topic includes curated:
  - Videos
  - Articles
  - Courses

---

### ✅ Progress Tracking
- Mark topics as completed
- Real-time progress updates
- Auto-save using debounced Firestore writes

---

### ⚡ Performance Optimization
- LocalStorage caching for career overviews (24h TTL)
- Reduces API calls and improves response time

---

## 🏗️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Context API (state management)

### Backend / Services
- Firebase Authentication
- Firestore Database

### AI Integration
- Google Gemini API
- Model used: `gemini-2.5-flash-lite`
- Used for:
  - Career overview generation
  - Structured roadmap creation

### Deployment
- Vercel

---

## 📂 Project Structure
```
src/
│
├── assets/                # Static assets (icons, images, etc.)
│
├── components/            # Reusable UI components
│   ├── ExploreCard.jsx
│   ├── PhaseCard.jsx
│   ├── RoadmapCard.jsx
│   ├── Navbar.jsx
│   ├── Loader.jsx
│   ├── ProtectedRoute.jsx
│   └── UserMenu.jsx
│
├── context/               # Global state management (React Context API)
│   └── AuthContext.jsx
│
├── data/                  # Static data used in the app
│   └── explorePaths.js
│
├── pages/                 # Route-level pages
│   ├── Home.jsx
│   ├── Explore.jsx
│   ├── Dashboard.jsx
│   ├── Roadmap.jsx
│   ├── CreateRoadmap.jsx
│   ├── Profile.jsx
│   ├── Login.jsx
│   └── Signup.jsx
│
├── services/              # External services and business logic
│   ├── firebase.js        # Firebase configuration
│   ├── geminiApi.js       # AI API integration
│   └── resourceEngine.js  # Resource generation logic
│
├── App.jsx                # Main app component (routing + layout)
├── main.jsx               # Entry point of the application
└── index.css              # Global styles (Tailwind CSS)

```

---

## 🧠 Key Design Decisions

- **Separation of Flow**
  - Explore → lightweight AI overview
  - Onboarding → full roadmap generation

- **Caching Strategy**
  - Career overviews cached using localStorage
  - 24-hour expiry to avoid stale data

- **Debounced Writes**
  - Reduces Firestore write operations
  - Improves performance and scalability

---

## ⚠️ Limitations

- Depends on external AI APIs (can fail or throttle)
- API key is exposed in frontend (not production-safe)
- Limited caching and retry strategies
- AI output depends on prompt quality

---

## 🚀 Future Improvements

- Move AI calls to backend for security
- Add retry + fallback mechanisms
- Improve prompt engineering
- Add analytics and personalization
- Enable shared/public roadmaps

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/SAI-0360/PathFinder-AI-Career-Companion.git
cd pathfinder
```
### 2. Install dependencies

```bash
npm install
```
### 3. Add Environment Variables

Create a `.env` file in the root directory of the project and add the following variables:

```
VITE_GEMINI_API_KEY=your_gemini_api_key_here

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```
### 4. Run locally

```bash
npm run dev
```
### 5. Open in browser
```
http://localhost:5173
```
---