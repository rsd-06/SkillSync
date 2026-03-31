# SkillSync — Prototype v1

Skill-based collaboration platform for KCT students.
Stack: Next.js · Node.js/Express · MongoDB Atlas · Zustand

---

## Local Setup (5 steps)

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/skillsync.git
cd skillsync

# Install server deps
cd server && npm install && cd ..

# Install client deps
cd client && npm install && cd ..
```


### 3. Seed the database

```bash
cd server && npm run seed
```

You'll see:
```
✅  Seed complete! Login with any of these:
   sudharshan@kct.ac.in / demo1234
   priya@kct.ac.in      / demo1234
   arjun@kct.ac.in      / demo1234
```

### 4. Run both servers

**Terminal 1 — backend:**
```bash
cd server && npm run dev
```

**Terminal 2 — frontend:**
```bash
cd client && npm run dev
```

### 5. Open browser

```
http://localhost:3000
```

Log in with any demo account. Password for all: `demo1234`

---

## What's in the prototype

| Page | Route | What it shows |
|------|-------|---------------|
| Login | `/login` | Auth with demo account quick-fill |
| Register | `/register` | New account creation |
| Feed | `/feed` | 8 ideas, search, filter by skill/status |
| Idea Detail | `/ideas/:id` | Full idea, apply, team, skill-match suggestions |
| Match | `/match` | All 5 users, filtered by skill + dept, match score |
| Profile | `/profile` | Edit skills, interests, bio, experience level |
| My Teams | `/teams` | 3 teams with task progress bars |
| Workspace | `/teams/:id` | Tasks (toggle status), hardcoded chat, milestones, members |

---

## Deploy to Vercel + Render

### Backend → Render

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo
4. Set **Root directory** to `server`
5. Build command: `npm install`
6. Start command: `node index.js`
7. Add environment variables:
   - `MONGO_URI` = your Atlas URI
   - `JWT_SECRET` = skillsync_jwt_secret_kct_2025
   - `CLIENT_URL` = https://your-vercel-url.vercel.app (fill after Vercel deploy)
   - `PORT` = 5000
8. Deploy. Copy the Render URL (e.g. `https://skillsync-server.onrender.com`)

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Set **Root directory** to `client`
4. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = your Render backend URL (from step 8 above)
5. Deploy

6. Go back to Render → your server → Environment → update `CLIENT_URL` to your Vercel URL

### Re-seed after deploy

```bash
cd server
MONGO_URI=<your_uri> node data/seed.js
```

---

## Demo Accounts

| Name | Email | Password | Dept | Year |
|------|-------|----------|------|------|
| Sudharshan R | sudharshan@kct.ac.in | demo1234 | EIE | 1 |
| Priya Meenakshi | priya@kct.ac.in | demo1234 | CSE | 2 |
| Arjun Senthil | arjun@kct.ac.in | demo1234 | CSE | 3 |
| Kavitha Lakshmi | kavitha@kct.ac.in | demo1234 | Mechanical | 2 |
| Rahul Krishnan | rahul@kct.ac.in | demo1234 | ECE | 3 |

---

## File Structure

```
skillsync/
├── server/
│   ├── index.js          ← Express entry point
│   ├── models/
│   │   ├── User.js
│   │   ├── Idea.js
│   │   └── Team.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── ideas.js
│   │   └── teams.js
│   ├── middleware/
│   │   └── auth.js
│   ├── data/
│   │   └── seed.js       ← Run once to populate DB
│   ├── .env
│   └── package.json
│
└── client/
    ├── src/app/
    │   ├── layout.js
    │   ├── page.js
    │   ├── globals.css
    │   ├── login/
    │   ├── register/
    │   ├── feed/
    │   ├── ideas/[id]/
    │   ├── match/
    │   ├── profile/
    │   └── teams/
    │       └── [id]/
    ├── src/components/
    │   ├── Navbar.js
    │   ├── IdeaCard.js
    │   ├── PostIdeaModal.js
    │   └── Hydrator.js
    ├── src/lib/api.js
    ├── src/store/useStore.js
    ├── .env.local
    └── package.json
```

---

## What's hardcoded (by design for prototype)

- **Chat messages** — pre-loaded in seed data. Socket.io in v1.
- **Workspace tabs** (file sharing, calendar, whiteboard) — UI stubs with "Coming in v1" labels
- **Reputation scores** — set in seed. Endorsement engine in v1.

---

Built by Sudharshan R · KCT · 2025
