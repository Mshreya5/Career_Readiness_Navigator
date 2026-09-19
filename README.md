# CareerNova – Career Readiness Navigator

> **EdTech Hackathon Platform for Career Readiness, Objective Skill Assessment & AI-Powered Learning Roadmaps**

---

## 🌟 Overview

**CareerNova** is an end-to-end EdTech navigation system designed to empower students to transition from current academic skills to industry-ready technical careers. 

Unlike generic career portals or simple questionnaire tools, CareerNova combines:
1. **Self-Declared Proficiency Rating**: Students baseline their knowledge across core technical domains.
2. **Objective Skill Assessment**: Knowledge Quizzes (concept-based MCQs, code reading, debugging, output prediction) and an integrated **Coding Round** with automated test-case evaluation.
3. **Deterministic Skill Intelligence**: Rules-based skill gap analyzer that blends self-reported data with objective test evidence to classify readiness into transparent levels (`Beginner`, `Basic`, `Intermediate`, `Strong`).
4. **Gemini AI Learning Engine**: Generates personalized revision advice, weak topic highlights, and a structured learning order based on actual assessment evidence.
5. **Phase-by-Phase Roadmap & Progress Tracker**: Step-by-step milestone execution plan with real-time percentage completion metrics.

---

## 🚀 Key Features

- **Google & JWT Authentication**: Fast, secure sign-in options with MongoDB persistence.
- **In-Demand Career Selection**: Pre-populated role profiles with comprehensive required skill matrices (Full Stack Developer, Data Scientist, Frontend Developer, Backend Developer, DevOps Engineer, etc.).
- **Skill Check & Coding Round**:
  - **Knowledge Quiz**: 5–10 timed questions per skill covering concepts, output prediction, and code debugging.
  - **Coding Round**: In-browser monospace code editor, problem descriptions, test case runner, and real-time pass/fail metrics.
- **Skill Gap & Readiness Analysis**:
  - Interactive donut chart & domain proficiency breakdown.
  - Transparent skill status badges (`MATCHED`, `PARTIAL`, `MISSING`, `DETECTED SKILL`).
  - Evidence-backed status explanations (*"Your profile says you know JavaScript, but your assessment indicates that you need more practice."*).
- **Gemini AI Recommendations**: Structured learning order and targeted study advice without AI hallucination of scores.
- **Personalized Roadmap & Progress Tracking**: Step-by-step milestones with interactive checkmarks and skill confidence indicators.

---

## 🏗 System Architecture & End-to-End User Flow

```
+-------------------+      +-------------------+      +-------------------------+
|  Student Profile  | ---> |   Target Career   | ---> |  Self-Declared Skills   |
+-------------------+      +-------------------+      +-------------------------+
                                                                   |
                                                                   v
+-------------------+      +-------------------+      +-------------------------+
| Roadmap & Progress| <--- | Gemini AI Feedback| <--- | Objective Skill Check   |
|   Milestones      |      | & Recommendations |      | (Quiz & Coding Round)   |
+-------------------+      +-------------------+      +-------------------------+
                                                                   |
                                                                   v
                                                      +-------------------------+
                                                      | Deterministic Skill Gap |
                                                      |    & Match Percentage   |
                                                      +-------------------------+
```

---

## 💻 Tech Stack

- **Frontend**:
  - React 18
  - Vite
  - CSS Modules (Cream & Forest Editorial Theme)
  - Lucide React Icons
  - Recharts (Interactive Donut & Progress Charts)
  - Axios API Client
- **Backend**:
  - Node.js & Express.js
  - MongoDB & Mongoose ORM
  - Google Generative AI SDK (`@google/generative-ai` / Gemini 1.5 Flash)
  - JSON Web Tokens (JWT) & bcryptjs
  - Dotenv environment configuration

---

## 📂 Repository Structure

```
Versathon-2.0/
├── server/
│   ├── config/
│   │   └── db.js                 # MongoDB connection logic
│   ├── controllers/
│   │   ├── analysisController.js  # Skill gap & Gemini recommendations
│   │   ├── assessmentController.js# Quiz & Coding round evaluation
│   │   ├── authController.js      # Register & Login controllers
│   │   ├── careerController.js    # Career directory APIs
│   │   ├── roadmapController.js   # Roadmap generation & milestone status
│   │   └── userController.js      # Student profile & skill management
│   ├── data/
│   │   └── questionBank.js       # Curated question bank & coding test cases
│   ├── models/
│   │   ├── Assessment.js         # Assessment schema
│   │   ├── Career.js             # Career schema
│   │   ├── Roadmap.js            # Roadmap schema
│   │   └── User.js               # Student User schema
│   ├── routes/
│   │   ├── analysisRoutes.js
│   │   ├── assessmentRoutes.js
│   │   ├── authRoutes.js
│   │   ├── careerRoutes.js
│   │   ├── roadmapRoutes.js
│   │   └── userRoutes.js
│   ├── services/
│   │   ├── aiRecommendationService.js # Gemini AI API integration
│   │   ├── priorityService.js         # Skill prioritization engine
│   │   ├── roadmapService.js          # Phase-by-phase roadmap generator
│   │   └── skillMatchingService.js    # Deterministic skill gap matcher
│   ├── e2e_test.js               # 40/40 Automated E2E test suite
│   ├── seed.js                   # Database seeder with complete career skills
│   └── server.js                 # Express server entry point
├── src/
│   ├── components/               # Layout, Navbar, Sidebar & UI components
│   ├── context/
│   │   └── AppContext.jsx        # Global React state & API provider
│   ├── data/
│   │   └── mockData.js           # Career matrices & fallback categories
│   ├── pages/
│   │   ├── Assessment.jsx        # Quiz & Coding round interface
│   │   ├── Careers.jsx           # Career selection view
│   │   ├── Dashboard.jsx         # Protected dashboard view
│   │   ├── Landing.jsx           # Public landing hero & workflow card
│   │   ├── Login.jsx             # Auth Login view with Google option
│   │   ├── Profile.jsx           # Student profile management
│   │   ├── Progress.jsx          # Progress & skill confidence tracker
│   │   ├── Roadmap.jsx          # Interactive learning roadmap
│   │   ├── Signup.jsx           # Auth Signup view
│   │   └── SkillGap.jsx         # Readiness donut & gap breakdown
│   ├── services/
│   │   └── api.js               # Axios REST API services
│   └── App.jsx                  # Main router configuration
└── README.md
```

---

## 🛠 Getting Started

### 1. Prerequisites
- **Node.js**: v18.x or higher
- **MongoDB**: Local MongoDB instance running on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI
- **Gemini API Key**: (Optional) `GEMINI_API_KEY` for live AI recommendations (falls back to deterministic AI advisor if omitted).

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/Mshreya5/Career_Readiness_Navigator.git
cd Career_Readiness_Navigator

# Install dependencies
npm install
cd server && npm install && cd ..
```

### 3. Environment Setup
Create `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/careernova
JWT_SECRET=careernova_secret_key_2026
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Seed Database
Seed standard careers and demo student data into MongoDB:
```bash
node server/seed.js
```

### 5. Running the Application

**Start Backend API Server**:
```bash
cd server
node server.js
```

**Start Frontend Application**:
```bash
# In the root directory
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🧪 Automated Testing

Run the automated integration test suite verifying 40 end-to-end endpoints across Auth, Careers, Skill Gap Analysis, Gemini Recommendations, Roadmap Generation, and Assessment Quizzes/Coding:

```bash
node server/e2e_test.js
```

**Expected Result**:
```
================ E2E SUMMARY ================
Total: 40  Passed: 40  Failed: 0
=============================================
```

To run the frontend production build:
```bash
npm run build
```

---

## 📄 License
This project is open-source and built for the Versathon EdTech Hackathon.