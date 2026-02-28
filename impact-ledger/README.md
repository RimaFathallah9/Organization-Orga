# Impact Ledger MVP 🎯

A gamified skill-validation system for activist hubs that bridges the gap between civic engagement and professional advancement. Turn your volunteer work into verifiable, blockchain-backed professional credentials.

## 📋 Quick Start

```bash
# Step 1: Navigate to project directory
cd "C:\Users\<YourUsername>\OneDrive\Desktop\10-AI-challenge\impact-ledger"

# Step 2: Install dependencies
npm install --legacy-peer-deps

# Step 3: Start development server
npm run dev

# Step 4: Open browser
# Visit: http://localhost:5173/
```

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation Guide](#installation-guide)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Architecture](#architecture)
- [Available Scripts](#available-scripts)
- [Troubleshooting](#troubleshooting)

---

## 🎨 Project Overview

**The Impact Ledger** is a comprehensive platform that:

- **For Volunteers:** Transforms civic engagement into a dynamic, cryptographically verifiable professional portfolio
- **For Organizations:** Enables precision volunteering with AI-powered skill matching
- **For Society:** Bridges corporate employability and community service

### Core Features
- ✨ Civic Skill Tree visualization with RPG-style progression
- 🎯 AI-powered mission marketplace with smart matching
- ✅ Impact verification & soulbound token issuance
- 🏆 Gamification with badges and achievements
- 💎 Premium glassmorphism UI with smooth animations

---

## ✨ Features

### Dashboard/Profile Page
- Interactive civic skill tree visualization
- Real-time XP and level progression tracking
- Badge collection system
- Mission completion history
- Skills categorized by expertise domain (Management, Operations, Marketing, etc.)

### Mission Marketplace
- AI-matched mission recommendations based on skill gaps
- Filter missions by type (Remote, Hybrid, Local)
- Match score calculation algorithm
- Mission details with skill requirements
- One-click mission application

### Evaluation & Verification Page
- Awaiting verification section for completed missions
- Verified missions showcase
- Organization-side verification interface
- Soulbound token minting simulation
- Impact confirmation workflow

### Premium UI/UX
- Glassmorphism design with blur effects
- Smooth Framer Motion animations
- Gradient text and background effects
- Responsive design (desktop, tablet, mobile)
- Custom scrollbars and focus states
- Dark theme with cyan & purple accent colors

---

## 📦 Prerequisites

Before running this project, ensure you have the following installed:

### Required
- **Node.js** (v16 or higher)
  - Download from: https://nodejs.org/
  - Verify: `node --version`
- **npm** (comes with Node.js)
  - Verify: `npm --version`

### Recommended
- **Git** (for version control)
- **VS Code** (or your preferred code editor)
- **Browser with DevTools** (Chrome, Firefox, Edge)

---

## 📥 Installation Guide - Step by Step

### Step 1: Navigate to Project Directory

Open PowerShell and navigate to the project:

```bash
cd "C:\Users\rimaf\OneDrive\Desktop\10-AI-challenge\impact-ledger"
```

Or if already in the 10-AI-challenge folder:

```bash
cd impact-ledger
```

### Step 2: Install Dependencies

The project uses several key dependencies. Run with legacy peer deps flag:

```bash
npm install --legacy-peer-deps
```

**What this installs:**
- React 18 - UI library
- TypeScript - Type safety
- Vite - Build tool
- Framer Motion - Animation library
- CSS Modules - Component styling

**Installation time:** 2-5 minutes depending on internet speed

### Step 3: Verify Installation

Check that all dependencies are installed correctly:

```bash
npm list
```

You should see all packages listed without errors.

---

## 🚀 Running the Application - Step by Step

### Start Development Server

In the project directory, run:

```bash
npm run dev
```

### Expected Output

You should see:
```
  VITE v5.0.0  ready in 234 ms

  ➜  Local:   http://localhost:5000/
  ➜  press h to show help
```

### Open in Browser

1. Copy the URL: `http://localhost:5000/`
2. Open your browser
3. Paste the URL in the address bar
4. Press Enter

### Application is Now Running!

You should see:
- **Navbar** with "Impact Ledger" logo and navigation links
- **Dashboard page** showing your volunteer profile
- **Civic Skill Tree** with unlocked and locked skills
- **Badges section** showing earned achievements

### Hot Module Replacement (HMR)

Any code changes you make will automatically reload in the browser without losing state!

**Example:** Try editing `src/pages/Dashboard.tsx` → Save → See changes instantly

---

## 🌐 Navigation

Once the app is running:

1. **Dashboard** - View your skill tree and profile
   - Shows unlocked skills with progress bars
   - Displays locked skills available to unlock
   - Badge collection display

2. **Marketplace** - Browse available missions
   - Filter missions by location type
   - See skill requirements
   - View match scores (AI-calculated compatibility)
   - Apply to missions

3. **Evaluation** - Verify completed missions
   - Review missions awaiting verification
   - Approve missions and award tokens
   - View verified mission history

---

## 📁 Project Structure

```
impact-ledger/
├── src/
│   ├── components/
│   │   ├── Badge.tsx           # Status & skill badges
│   │   ├── Button.tsx          # Multi-variant button
│   │   ├── Card.tsx            # Container component
│   │   ├── Navbar.tsx          # Navigation bar
│   │   ├── SkillBar.tsx        # Skill progress bar
│   │   └── *.module.css        # Component styles
│   │
│   ├── pages/
│   │   ├── Dashboard.tsx       # Volunteer profile
│   │   ├── Marketplace.tsx     # Mission discovery
│   │   ├── Evaluation.tsx      # Impact verification
│   │   └── *.module.css
│   │
│   ├── layouts/
│   │   ├── MainLayout.tsx      # App wrapper
│   │   └── MainLayout.module.css
│   │
│   ├── data/
│   │   └── mockData.ts         # Sample data
│   │
│   ├── App.tsx                 # Main component
│   ├── main.tsx                # Entry point
│   ├── index.css               # Global styles
│   └── assets/
│
├── public/                     # Static files
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── vite.config.ts              # Build config
├── index.html                  # HTML entry point
└── README.md                   # This file
```

---

## 🛠 Technologies Used

- **React 18** - Modern UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Lightning-fast build tool
- **Framer Motion** - Smooth animations
- **CSS Modules** - Scoped styling
- **React Router** - Client-side navigation (future)

---

## 📜 Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint for code quality
npm run lint

# Check TypeScript compilation
npm run type-check
```

---

## 🔧 Troubleshooting

### Port 5173 Already in Use

```bash
# Find and kill the process
netstat -ano | findstr :
taskkill /PID <PID> /F
```

Then restart:
```bash
npm run dev
```

### Module Not Found Errors

```bash
# Clear cache and reinstall
rmdir /s node_modules
del package-lock.json
npm install --legacy-peer-deps
```

### CSS Not Loading

- Clear browser cache: `Ctrl+Shift+Delete`
- Restart dev server: Press `q` then `npm run dev`

### TypeScript Errors in IDE

- Press `Ctrl+Shift+P` in VS Code
- Type "TypeScript: Restart TS Server"
- Select and press Enter

### Application Won't Start

1. Verify Node version: `node --version` (should be v16+)
2. Check all dependencies: `npm list`
3. Delete `node_modules` and reinstall
4. Restart your computer

---

## 📊 Mock Data

The app uses sample data from `src/data/mockData.ts`:

```typescript
// User Profile
mockUserProfile = {
  name: 'Leo Chen',
  location: 'San Francisco, CA',
  totalMissionsCompleted: 3,
  totalXpEarned: 2450,
  verifiedTokens: 3
}

// 6 sample skills with different states
// 4 AI-matched missions
// 3 completed missions awaiting verification
// 3 earned badges
```

To modify mock data:
1. Open `src/data/mockData.ts`
2. Update the data
3. Changes appear instantly in browser

---

## 🎮 Feature Walkthrough

### Dashboard Actions
- View profile stats (total level, XP, missions)
- See skill progression with XP bars
- Discover next skills to unlock
- Review earned badges

### Marketplace Actions
- Browse missions (4 sample missions)
- Filter by type: Remote, Hybrid, Local
- Check AI match score (0-100%)
- Apply to missions with one click

### Evaluation Actions
- Review awaiting verification (1 mission)
- Approve with verification notes
- View verified history (2 missions)
- Simulate soulbound token issuance

---

## 💡 Tips & Best Practices

1. **Keep Dev Server Running** - Don't close the terminal
2. **Check Browser Console** - Press F12 for errors
3. **Use Browser DevTools** - Inspect elements, debug CSS
4. **Try Responsive Design** - Press F12 → Toggle Device Toolbar
5. **Reload if Stuck** - Press F5 or Ctrl+R

---

## 🌐 Browser Support

- ✅ Chrome/Edge (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Mobile browsers

---

## 📚 Learning Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Framer Motion](https://www.framer.com/motion/)

---

## 🎯 Next Steps

Future enhancement opportunities:
- Backend API integration
- Real blockchain integration (Polygon)
- User authentication
- PostgreSQL database
- Production deployment

---

## 🚀 Summary

**To get started:** 
```bash
cd impact-ledger
npm install --legacy-peer-deps
npm run dev
# Open http://localhost:5000/
```

Enjoy exploring the Impact Ledger MVP! 🎉
