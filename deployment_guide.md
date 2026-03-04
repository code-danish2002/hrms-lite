# 🚀 Final Submission & Deployment Guide

Follow these steps exactly to move your project from your local machine to a live, production-ready environment.

---

## 1. Prepare for GitHub

### Create a Repository
1. Go to [GitHub](https://github.com) and create a new **Public** repository named `hrms-lite`.
2. **Do not** initialize it with a README, license, or gitignore (we already have them).

### Push Your Code
Run these commands in your project root terminal (`d:\Works\assignment`):

```bash
# Initialize git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: HRMS Lite with Dark Mode and Reporting"

# Link to your GitHub repo (Replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/hrms-lite.git

# Push to main
git branch -M main
git push -u origin main
```

---

## 2. Deploy the Backend (Render)

1. Create a free account on [Render](https://render.com).
2. Click **New +** > **Web Service**.
3. Connect your GitHub repository.
4. Set the following configurations:
    - **Name**: `hrms-backend`
    - **Root Directory**: `backend`
    - **Environment**: `Python 3`
    - **Build Command**: `pip install -r requirements.txt`
    - **Start Command**: `gunicorn main:app -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT`
5. **Environment Variables** (Click "Advanced"):
    - `DATABASE_URL`: (Use your Neon.tech or Render Postgres URL)
6. Click **Deploy Web Service**.
7. **Copy the URL** provided by Render (e.g., `https://hrms-backend.onrender.com`).

---

## 3. Deploy the Frontend (Vercel)

1. Create a free account on [Vercel](https://vercel.com).
2. Click **Add New** > **Project**.
3. Import your `hrms-lite` repository.
4. Set the following configurations:
    - **Framework Preset**: `Vite`
    - **Root Directory**: `frontend`
5. **Environment Variables**:
    - `VITE_API_URL`: (Paste your Render Backend URL here, **without** a trailing slash)
6. Click **Deploy**.

---

## 4. Final Updates (Very Important)

Once everything is deployed, you should update two things to make it perfect:

1. **Backend CORS**:
   Open `backend/main.py` and update line 17 from `["*"]` to your **live Vercel URL**. This is safer.
   ```python
   allow_origins=["https://your-frontend.vercel.app"]
   ```
2. **README.md**:
   Add your live links to the top of the README.

---

## 💡 Pro-Tip for Interviewers
If they ask about the code:
- **Style**: Mention you followed **Clean Code** principles, using modular components and separation of concerns (CRUD logic separated from Route logic).
- **Tech**: Explain why you chose **FastAPI** (speed/async) and **Tailwind 4** (CSS-first modern styling).
- **UX**: Highlight the **Dark Mode persistence** and **Date Filtering** as specific improvements you added for better admin usability.
