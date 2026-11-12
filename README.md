# Forge LMS — Simplified Learning Management System

> Built with the **MERN Stack + TypeScript** (Next.js 16 App Router, React 19, Tailwind CSS, Express.js, MongoDB Atlas with Mongoose, Zod, JWT & bcrypt).

---

## 🌐 Live Demo & Credentials

| Service                        | Environment | URL                                                                                      |
| ------------------------------ | ----------- | ---------------------------------------------------------------------------------------- |
| **Frontend (Student & Admin)** | Production  | [https://forge-lms-mu.vercel.app](https://forge-lms-mu.vercel.app)                       |
| **Backend API Server**         | Production  | [https://forge-lms-backend.vercel.app](https://forge-lms-backend.vercel.app)             |
| **Backend API Health Check**   | Production  | [https://forge-lms-backend.vercel.app/api/health](https://forge-lms-backend.vercel.app/) |

### 🔑 Evaluator Test Credentials

- **Role:** Administrator
- **Login URL:** `/admin/login` (accessible from the top navigation bar)
- **Email:** `admin@forgelms.local`
- **Password:** `Admin1234!`

> **Note on Student Access:** Per the assessment specification, student registration, payment, enrollment, and file uploads are **strictly not required**. The Student Panel is 100% open-access, students can browse courses, inspect syllabi, and watch embedded video lectures immediately without any login or paywall friction.

---

## 🚀 Key Features

### 1. 🎓 Student Panel (Public)

- **Modern Educational Landing Page (`/`):**
  - High-impact hero section with value highlights.
  - Real-time search filter and category pills (_All Tracks_, _Full-Stack & MERN_, _Backend & APIs_, _Frontend & React_, _Databases_).
  - Authentic course cards featuring token-based geometric artwork, dynamic tag badges, lecture count indicators, and price tags (`$49`).
- **Dedicated Student Dashboard (`/dashboard`):**
  - **"Continue Where You Left Off" spotlight card:** Automatically remembers the student's last watched lecture using browser `localStorage` and provides a 1-click **"Resume Lecture →"** button.
  - Overview metrics: Available Tracks, Total Video Lessons, In-Progress count, and Open Access badge.
  - Recent watch history list and interactive catalog explorer.
- **Course Details & Syllabus View (`/courses/:id`):**
  - Complete course metadata, hero banner, description, and "Start first lecture" CTA.
  - Full sequential lecture curriculum table displaying order number, title, and direct watch action.
- **Distraction-Free Lecture Player (`/courses/:id/lectures/:lectureId`):**
  - Responsive **16:9 safe video player** validating and normalizing YouTube and Vimeo URLs into safe embed iframes.
  - Bidirectional navigation buttons (`← Previous` and `Next lecture →`).
  - Collapsible playlist drawer highlighting the currently active lesson.

### 2. 🔐 Admin Dashboard (Protected Management)

- **Secure Authentication:**
  - Bcrypt password hashing (10 salt rounds) and server-side signed JWTs.
  - Clean login interface (`/admin/login`) with manual credential entry (no hardcoded form pre-filling).
- **3-Layer Route Protection:**
  1. **Edge Middleware (`src/middleware.ts`):** Next.js server-side cookie verification instantly redirects unauthenticated direct visits on `/admin/*` to `/admin/login` before page HTML renders.
  2. **Client Layout Guard (`src/app/admin/layout.tsx`):** Validates client session state, prevents unauthorized rendering, and automatically redirects authenticated admins away from `/admin/login` to the dashboard.
  3. **Backend Middleware (`requireAdmin.ts`):** Every single mutating API endpoint (`POST`, `PUT`, `DELETE`) verifies the cryptographic JWT token. Returns HTTP `401 Unauthorized` on missing or expired tokens with automatic frontend session cleanup.
- **Course Management (CRUD):**
  - Course table view (`/admin/courses`) showing thumbnails, title, price, and lecture count.
  - Create course (`/admin/courses/new`) and Edit course (`/admin/courses/:id/edit`) with live artwork preview.
  - Cascade deletion modal: Deleting a course cleanly removes the course and all associated lectures from MongoDB.
- **Lecture Management (CRUD):**
  - Course-specific lecture manager (`/admin/courses/:id/lectures`).
  - Add, reorder, edit, and delete lectures with title, description, and validated video URL.

### 3. 🛠️ Architecture & Technical Rigor

- **Strict MVC Backend:** Clear separation of concerns — `routes/` wire HTTP endpoints, `controllers/` execute business logic and response envelopes, and `models/` enforce database schemas and indexes. Zero business logic inside routes.
- **Zod Schema Validation:** Every incoming request body, parameter ID (valid MongoDB ObjectId check), and URL protocol is validated before touching controllers.
- **State Management & UX Handling:** Loading skeletons (`CourseSkeletonGrid`), empty states with SVG illustrations (`EmptyCoursesState`), and network failure states with retry handlers (`ErrorCoursesState`).
- **Design Token Adherence:** Strictly adheres to the assessment design canvas:
  - Paper `#F6F4EF` · Surface `#FFFFFF` · Ink `#15171C` · Muted `#5B606B` · Accent `#C2410C` · Danger `#B42318`.

---

## 📁 Repository Structure

```text
forge-lms/
├── forge-lms-backend/               # Node.js + Express + TypeScript MVC Backend
│   ├── api/
│   │   └── index.js                 # Vercel serverless function entrypoint
│   ├── src/
│   │   ├── config/                  # DB connection pool (Mongoose) & Zod env parser
│   │   ├── controllers/             # auth, course, and lecture controllers
│   │   ├── middleware/              # requireAdmin (JWT), validate (Zod), errorHandler
│   │   ├── models/                  # Admin, Course (with virtuals), Lecture schemas
│   │   ├── routes/                  # Express routers (MVC wiring)
│   │   ├── seed/                    # Database seeder (6 courses, 23 lectures)
│   │   ├── utils/                   # ApiError, safe videoUrl validator, asyncHandler
│   │   ├── app.ts                   # Express app factory with CORS & auto-connect
│   │   └── server.ts                # Standalone HTTP server runner
│   ├── vercel.json                  # Vercel serverless deployment routing
│   └── package.json
│
├── forge-lms-frontend/              # Next.js 16 (Turbopack/Webpack) + React 19 Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── admin/               # Protected admin courses, form, & lecture manager
│   │   │   ├── courses/             # Student course details & lecture watch player
│   │   │   ├── dashboard/           # Student learning dashboard & watch history
│   │   │   ├── globals.css          # Design tokens & utility classes
│   │   │   ├── layout.tsx           # Root HTML layout with Google Fonts & extension guards
│   │   │   └── page.tsx             # Modern educational landing page & course catalog
│   │   ├── components/              # Header, Footer, CourseCard, AdminSidebar, States
│   │   ├── config/                  # Centralized API_BASE_URL resolver
│   │   ├── types/                   # TypeScript domain contracts & API envelopes
│   │   ├── utils/                   # Auth session manager & safe embed URL parser
│   │   └── middleware.ts            # Edge route protection for /admin routes
│   └── package.json
│
├── docs/                            # Comprehensive documentation & assessment specs
├── CHANGELOG.md                     # Semantic versioned change log
└── README.md                        # Project overview & evaluator guide
```

---

## 💻 Local Setup & Run Guide

### Prerequisites

- **Node.js:** v18.0.0 or later (LTS recommended)
- **npm:** v9.0.0 or later
- **MongoDB:** MongoDB Atlas cloud cluster (configured by default) or local MongoDB instance

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/Rakibislam22/Forge-LMS.git
cd Forge-LMS
```

---

### Step 2: Backend Setup & Seed

1. **Navigate to the backend workspace:**

   ```bash
   cd forge-lms-backend
   npm install
   ```

2. **Configure environment variables:**
   Create a `.env` file in `forge-lms-backend/` (or copy from `.env.example`):

   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=super_secret_forge_lms_jwt_key_at_least_32_characters_long
   JWT_EXPIRES_IN=8h
   CLIENT_ORIGIN=http://localhost:3000
   ADMIN_EMAIL=admin@forgelms.local
   ADMIN_PASSWORD=Admin1234!
   BCRYPT_ROUNDS=10
   LOGIN_RATE_LIMIT_MAX=10
   ```

3. **Seed the database (6 courses, 23 video lectures, admin account):**

   ```bash
   npm run seed
   ```

4. **Start the Express API server:**
   ```bash
   npm run dev
   ```
   _Server will run at `http://localhost:5000` with health check at `http://localhost:5000/`._

---

### Step 3: Frontend Setup

1. **Open a new terminal and navigate to the frontend workspace:**

   ```bash
   cd forge-lms-frontend
   npm install
   ```

2. **Configure environment variables:**
   Create a `.env.local` file in `forge-lms-frontend/`:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

3. **Start the Next.js development server:**
   ```bash
   npm run dev
   ```
   _Open [http://localhost:3000](http://localhost:3000) in your browser._

---

## 🚢 Deployment Details (Vercel)

Both workspaces are optimized for independent, zero-friction deployment on Vercel.

### 1. Deploying the Backend (`forge-lms-backend`)

1. In the [Vercel Dashboard](https://vercel.com), click **Add New Project** and select your repository.
2. In **Root Directory**, click _Edit_ and select **`forge-lms-backend`**.
3. Under **Environment Variables**, add:
   - `MONGODB_URI` = your MongoDB connection string
   - `JWT_SECRET` = your secret string (at least 32 characters)
   - `CLIENT_ORIGIN` = `*` (or your frontend Vercel URL)
   - `ADMIN_EMAIL` = `admin@forgelms.local`
   - `ADMIN_PASSWORD` = `Admin1234!`
   - `NODE_ENV` = `production`
4. Click **Deploy**. Vercel will compile the serverless function handler via `vercel.json` and output your live backend URL (e.g. `https://forge-lms-backend.vercel.app`).

### 2. Deploying the Frontend (`forge-lms-frontend`)

1. Click **Add New Project** and select your repository.
2. In **Root Directory**, select **`forge-lms-frontend`**.
3. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_API_URL` = `https://forge-lms-backend.vercel.app/api` (your live backend URL).
4. Click **Deploy**. Your student and admin panels will be live with full real-time database connectivity.

---

## 📡 REST API Reference

All responses follow the unified response envelope: `{ "success": boolean, "data"?: T, "error"?: { "code": string, "message": string } }`.

| Method   | Endpoint                               | Access          | Description                                               |
| -------- | -------------------------------------- | --------------- | --------------------------------------------------------- |
| `GET`    | `/` or `/health`                       | Public          | API health check and server status                        |
| `POST`   | `/api/auth/login`                      | Public          | Admin login, returns signed JWT token                     |
| `GET`    | `/api/courses`                         | Public          | List all courses with lecture counts                      |
| `GET`    | `/api/courses/:id`                     | Public          | Get single course and its full lecture list               |
| `POST`   | `/api/courses`                         | **Admin (JWT)** | Create a new course                                       |
| `PUT`    | `/api/courses/:id`                     | **Admin (JWT)** | Update existing course details                            |
| `DELETE` | `/api/courses/:id`                     | **Admin (JWT)** | Delete course and cascade delete all its lectures         |
| `GET`    | `/api/courses/:id/lectures`            | Public          | List all lectures belonging to a course                   |
| `GET`    | `/api/courses/:id/lectures/:lectureId` | Public          | Get single lecture with next/previous navigation pointers |
| `POST`   | `/api/courses/:id/lectures`            | **Admin (JWT)** | Add a new lecture to a course                             |
| `PUT`    | `/api/courses/:id/lectures/:lectureId` | **Admin (JWT)** | Update lecture title, description, or video URL           |
| `DELETE` | `/api/courses/:id/lectures/:lectureId` | **Admin (JWT)** | Delete a single lecture                                   |

---

## 🧪 Verification & Quality Checks

Run linting and static type checking across the project:

```bash
# Frontend typecheck & lint
cd forge-lms-frontend
npx tsc --noEmit
npm run lint

# Backend build & typecheck
cd ../forge-lms-backend
npm run build
```

---

## 📄 License

Created for the **DataPollex Ltd.** Industrial Training Recruitment Assessment.
All rights reserved © 2026.
