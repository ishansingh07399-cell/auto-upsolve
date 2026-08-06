# 🔁 Auto-Upsolve

> Automatically fetch and track your unsolved competitive programming problems from **Codeforces**, **LeetCode**, and **CodeChef** — all in one place.

![Auto-Upsolve](https://img.shields.io/badge/status-active-brightgreen?style=flat-square)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38BDF8?style=flat-square&logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel)

---

## 🧠 What is Upsolving?

**Upsolving** is when you go back and solve problems from contests you participated in but couldn't finish during the contest. It's one of the most effective ways to improve in competitive programming. Auto-Upsolve automates the tracking so you never lose sight of what you still need to solve.

---

## ✨ Features

- 🔴 **Codeforces** — Fetches submissions via the official API, computes unsolved problems
- 🟡 **LeetCode** — Filters non-accepted submissions via an API wrapper
- 🟤 **CodeChef** — Scrapes attempted-but-not-solved problems via a Vercel proxy (bypasses CORS)
- ✅ **Mark as Upsolved** — One click to mark a problem done; persists across sessions
- 💾 **LocalStorage** — All handles and progress saved locally in your browser
- 🔍 **Filter by Platform** — View All / Codeforces / LeetCode / CodeChef
- 👁️ **Hide Completed** — Focus only on what's left
- 📊 **Progress Bar** — Visual upsolve percentage tracker
- 🌙 **Dark Mode** — Hacker-aesthetic dark UI with glassmorphism design
- ⚡ **Parallel Fetching** — All 3 platforms fetched simultaneously; one failure doesn't block the others

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Tailwind CSS, Lucide React |
| Build Tool | Vite |
| Backend / Proxy | Vercel Serverless Functions (Node.js) |
| Scraping | Axios + Cheerio (for CodeChef) |
| State | React Hooks + LocalStorage |
| Deployment | Vercel |

---

## 📁 Project Structure

```
auto-upsolve/
├── api/
│   └── codechef.js          # Vercel serverless function — CodeChef CORS proxy
├── src/
│   ├── App.jsx              # Root component
│   ├── main.jsx             # React entry point
│   ├── index.css            # Global styles + design system
│   ├── components/
│   │   ├── Header.jsx       # Sticky header with stats & sync button
│   │   ├── SettingsModal.jsx# Handle configuration modal
│   │   ├── FilterBar.jsx    # Platform filter + hide-completed toggle
│   │   ├── ProblemCard.jsx  # Individual problem card
│   │   ├── SkeletonCard.jsx # Loading skeleton
│   │   └── EmptyState.jsx   # Onboarding / empty screen
│   ├── hooks/
│   │   └── useUpsolve.js    # Core state, localStorage, sync logic
│   └── utils/
│       └── fetchers.js      # fetchAllUnsolved() — parallel API calls
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── vercel.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- npm

### Run Locally (Frontend only)

```bash
git clone https://github.com/ishansingh07399-cell/auto-upsolve.git
cd auto-upsolve
npm install
npm run dev
```

Open **http://localhost:5173**

> ⚠️ The CodeChef proxy (`/api/codechef`) won't work in this mode. To test it locally, use `vercel dev` (see below).

### Run Locally (Full-stack with CodeChef proxy)

```bash
npm install -g vercel
vercel dev
```

Open **http://localhost:3000**

---

## 🌐 Deploying to Vercel

1. Push your repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) → Import the `auto-upsolve` repo
3. Vercel auto-detects Vite — confirm these settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Click **Deploy**

The `api/` folder is automatically deployed as serverless functions. No extra config needed.

---

## 🔌 How It Works

### Codeforces
Uses the [official Codeforces API](https://codeforces.com/apiHelp):
- Fetches last 500 submissions via `user.status`
- Builds a set of `OK` verdict problems (fully solved)
- Returns problems attempted but never solved

### LeetCode
Uses [alfa-leetcode-api](https://github.com/alfaarghya/alfa-leetcode-api):
- Fetches recent submissions
- Filters out `Accepted` ones and deduplicates by `titleSlug`
- Has a **25-second timeout** for cold-start handling

### CodeChef
A Vercel serverless function at `/api/codechef`:
- Fetches the HTML profile page via `axios`
- Parses it with `cheerio` to extract "Fully Solved" and "Attempted" sections
- Returns problems attempted but not fully solved
- Adds `Access-Control-Allow-Origin: *` headers

---

## 💾 LocalStorage Keys

| Key | Description |
|---|---|
| `au_handles` | Your saved platform handles `{ cf, lc, cc }` |
| `au_upsolved_ids` | Array of problem IDs you've marked as upsolved |

---

## 📸 UI Overview

| Component | Description |
|---|---|
| **Header** | App logo, live stats (Total / Upsolved / Remaining), Sync & Settings buttons |
| **Settings Modal** | Input your 3 platform handles; links to your profile pages |
| **Filter Bar** | Platform pills with counts, Hide Completed toggle, error banners |
| **Progress Bar** | Gradient green bar showing % upsolved |
| **Problem Card** | Platform badge, difficulty color, tags (CF), Mark/Unmark Upsolved |
| **Skeleton Cards** | Animated pulse placeholders while fetching |
| **Empty State** | Onboarding screen or "all caught up" message |

---

## ⚠️ Known Limitations

- **CodeChef scraping** depends on their HTML structure — may break if CodeChef redesigns their profile page
- **LeetCode API** is unofficial and may have cold-start delays (~30s on first request)
- **Codeforces API** is rate-limited; fetching too frequently may result in temporary blocks
- Problems are stored in `localStorage` only — clearing browser data resets your upsolved list

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

```bash
# Fork → Clone → Branch → Commit → Push → PR
git checkout -b feature/your-feature
git commit -m "feat: your feature"
git push origin feature/your-feature
```

---

## 📄 License

MIT © [Ishan Singh](https://github.com/ishansingh07399-cell)

---

<p align="center">Made with ☕ for competitive programmers who actually want to get better.</p>
