# SCiVLab

Interactive Algorithm Learning & Visualization Platform.

Students can:
- Learn algorithms visually
- Understand flowcharts & theory
- Practice coding problems
- Run Python code
- Track progress

Teachers/Admins can:
- Monitor student progress
- Track completed algorithms
- Review submissions
- Analyze activity

---

# Features

# Student Features

## 1. Algorithm Dashboard
- Browse all algorithms
- Interactive UI cards
- Progress based unlocking system

## 2. Algorithm Workspace
Each algorithm contains:
- Theory
- Flowchart
- Visualization
- Code Editor
- Pseudocode
- Complexity Analysis

## 3. Visualization Engine
Supports:
- Searching Algorithms
- Sorting Algorithms
- Step-by-step animation
- Highlighting active elements
- Success & failure states

## 4. Python Code Execution
- Execute Python code
- Run against test cases
- Validate outputs
- Error handling

## 5. Progress Tracking
- Save completed algorithms
- Track progress percentage
- Unlock next algorithm automatically

---

# Admin / Teacher Features

## 1. Admin Dashboard
Displays:
- Total students
- Total algorithms
- Total submissions
- Total completed algorithms

## 2. Student Monitoring
Teachers can:
- View all students
- Monitor progress percentage
- View completed algorithms
- View pending algorithms
- Track latest activity

## 3. Submission Management
- Review code submissions
- Approve / reject solutions
- Give feedback

---

# Tech Stack

# Frontend
- React.js
- React Router DOM
- Tailwind CSS
- ShadCN UI
- Lucide React Icons
- React Hot Toast
- Motion

# Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

# Python Execution
- PythonShell
- Python Runtime

---

# Folder Structure

```bash
algo_demonstrator/
│
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── app.js
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── pages/
│   │   └── utils/
│   └── public/
│
└── README.md
```

---

# Authentication

JWT based authentication system.

Roles:
- Student
- Admin

Protected Routes:
- Student Routes
- Admin Routes
- Submission Routes
- Progress Routes

---

# Database Models

# User
Stores:
- Username
- Password
- Role

# Algorithm
Stores:
- Theory
- Examples
- Test Cases
- Flowcharts
- Animation Steps
- Code Snippets

# UserProgress
Stores:
- Completed Algorithms
- Completion Time

# Submission
Stores:
- Submitted Code
- Status
- Feedback

# Assignment
Stores:
- Student Assignments

---

# API Routes

# Auth Routes

```bash
/api/auth/register
/api/auth/login
```

# Algorithm Routes

```bash
/api/algorithms
/api/algorithms/:slug
```

# Progress Routes

```bash
/api/progress
/api/progress/complete
/api/progress/user-progress
/api/progress/next-unlocked
```

# Code Execution Route

```bash
/api/progress/execute/run
```

# Admin Routes

```bash
/api/admin/stats
/api/admin/students
/api/admin/students/:id
```

# Submission Routes

```bash
/api/submissions
```

---

# Installation

# 1. Clone Repository

```bash
git clone git@github.com:enn-dee/AlgoLab.git
```

---

# 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

# 3. Install Backend Dependencies

```bash
cd backend
npm install
```

---

# Environment Variables

Create `.env` inside backend folder.

```env
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

---

# Run Project

# Start Backend

```bash
cd backend
node app.js
```

# Start Frontend

```bash
cd frontend
npm run dev
```

---

# Build Frontend

```bash
npm run build
```

---

# Main Functionalities

## Student Workflow
1. Login/Register
2. Open Algorithm Dashboard
3. Select Algorithm
4. Read Theory
5. View Flowchart
6. Watch Visualization
7. Solve Problem
8. Submit Code
9. Mark Algorithm Completed

---

## Teacher Workflow
1. Login as Admin
2. Open Admin Dashboard
3. Monitor Students
4. View Student Progress
5. Review Submissions
6. Analyze Completion Statistics

---

# Visualization Examples

Supports:
- Bubble Sort
- Binary Search
- Linear Search
- Palindrome Checking
- Two Sum Problem
- Custom animations

---

# Future Improvements

- AI Generated Explanations
- Multi-language Compiler
- Leaderboards
- Real-time Collaborative Coding
- Plagiarism Detection
- Teacher Assignments
- Analytics Dashboard
- Voice Based Explanation
- Dark/Light Theme

---

# Screens Included

- Student Dashboard
- Algorithm Workspace
- Visualization Panel
- Flowchart Viewer
- Admin Dashboard
- Student Monitoring Panel

---

# Learning Outcomes

Students can:
- Understand algorithms visually
- Improve coding skills
- Learn time & space complexity
- Practice problem solving
- Track learning progress

---

