# HRMS Lite

A lightweight Human Resource Management System (HRMS) built with FastAPI, React, and PostgreSQL.

## Key Features (Premium Interview-Ready)
- **🌓 Adaptive Dark Mode**: Full theme support with system-preference detection and persistence.
- **📊 Interactive Dashboard**: Real-time stats with **Date filtering** to view historical attendance trends.
- **📁 CSV Export**: Generate professional employee reports with one click.
- **🔍 Advanced Filtering**: Search by name/ID and filter by **Department** for granular management.
- **🚀 Smart Navigation**: "Quick Actions" that auto-open forms for a frictionless admin experience.
- **Employee Management**: Full CRUD operations with robust server-side validations.
- **Attendance Tracking**: Simple, intuitive marking and history tracking.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Lucide React, Axios.
- **Backend**: FastAPI, SQLAlchemy, PostgreSQL, Pydantic.
- **Database**: PostgreSQL.

## Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- PostgreSQL server

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file based on the provided configuration:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/db_name
   ```
5. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment Guide

For a fully functional live application, follow these steps:

### 1. Database (Neon / Render)
- **Option A (Neon.tech)**: Create a free PostgreSQL instance on [Neon](https://neon.tech). It's fast and reliable.
- **Option B (Render PostgreSQL)**: Create a "Blueprints" or a Standalone PostgreSQL on Render.
- **Set Environment Variable**: Copy the `External Database URL` and use it in your backend configuration.

### 2. Backend (Render)
- Create a new **Web Service** on Render.
- Connect your GitHub repository.
- **Root Directory**: `backend`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Environment Variables**:
    - `DATABASE_URL`: Your hosted PostgreSQL URL.

### 3. Frontend (Vercel)
- Create a new Project on Vercel.
- Connect your GitHub repository.
- **Framework Preset**: `Vite`
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
    - `VITE_API_URL`: Your live Render Backend URL (e.g., `https://your-app.onrender.com`).

---

## Design Decisions
- **Modularity**: Components are broken down for reusability.
- **Clean UI**: Used a curated color palette (Primary Blue) and consistent spacing.
- **Robustness**: Server-side validations for email and employee IDs.
