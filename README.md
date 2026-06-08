# Sproutopia: Grow Your World 🌱✨

> A cozy pixel-art sustainability adventure in your browser. Live greener, earn seeds, defeat Smogzilla, and restore a polluted wasteland into a thriving paradise!

---

## 🎮 Game Lore & Problem Statement

Our beautiful pixel world was clean and green, until **Smogzilla**—the embodiment of carbon emission waste and consumerism—invaded and turned it into a grey, polluted wasteland.

We can't defeat Smogzilla with magic swords; we can only defeat him through **real-life actions**. Every time you make a green choice in the physical world (like walking instead of driving, reducing your shower time, or support local businesses), your game character **Bloomy** gains XP, coins, and the strength to shrink Smogzilla's toxic smog, restoring nature segment by segment.

---

## ✨ Features

- 🎯 **Daily Eco Missions**: 12 curated sustainability tasks (reusable bottles, unplugging chargers, public transit, local shopping) refreshed daily.
- 🌍 **Evolving World Scene**: Interactive graphic canvas that changes dynamically. Watch sky colors shift from smoggy grey to baby blue, grass turn emerald, flowers bloom, and woodland creatures return!
- 🦸 **"Smogzilla Defeated" Celebration**: Clear all daily tasks to unlock Bloomy’s Hero costume (golden crown + red cape), banish Smogzilla with a puff, trigger pixel confetti falling, and watch animals dance!
- 📊 **Real Carbon Footprint Math**: Onboarding calculator translates lifestyle answers into trees to offset, car trip equivalents, and initial carbon health scores.
- 🏆 **Eco Achievements & Streaks**: Earn titles from _Seed_ to _Planet Protector_, and badges like _Plastic-Free Hero_ or _Carbon Crusher_ for maintaining consistent daily streaks.
- 🧠 **Bloomy AI Coach**: Talk to Bloomy directly in chat for friendly, tailored tips on improving your real-world green habits!

---

## ⚙️ Game Mechanics

### 1. Carbon Score & World Stages

Your initial Carbon Score is calculated during onboarding based on transport, electricity, diet, shopping, and recycling habits:
$$\text{Composite Score} = \text{Carbon Score (0-100)} + \min(50, \text{Total Completed Tasks} \times 2)$$

As your composite score grows, the world upgrades through **6 stages**:

1. 🪨 **Polluted Wasteland** (Stage 0)
2. 🪵 **Small Green Patch** (Stage 1)
3. 🌸 **Flower Garden** (Stage 2)
4. 🌲 **Growing Forest** (Stage 3)
5. 🦌 **Wildlife Sanctuary** (Stage 4)
6. 🏝️ **Thriving Paradise** (Stage 5)

### 2. Bloomy Leveling System

Complete tasks to earn XP and level up:

- **Seed** (0 XP)
- **Sprout** (80 XP)
- **Sapling** (220 XP)
- **Tree** (450 XP)
- **Forest Guardian** (800 XP)
- **Planet Protector** (1300 XP)

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TanStack Start (TypeScript)
- **Router**: TanStack Router
- **State Management**: React Hooks + LocalStorage Persistence
- **Aesthetics**: Vanilla CSS (Pixel-Art Theme, custom animations, scanline filters, grid graphics)
- **Icons**: Lucide React + Curated Emojis
- **Utilities**: clsx, tailwind-merge, date-fns

---

## 🚀 Installation & Local Run Guide

### Prerequisites

You need **Node.js** (v18+) and **npm** installed on your system. This project can also be managed with **Bun**.

### Environment Setup

Create a `.env` file in the root directory of the project and add your Google Gemini API key:

```env
VITE_GEMINI_API_KEY="your_actual_gemini_api_key_here"
```

### 1. Clone & Enter Project

```bash
git clone <repository-url>
cd "Sproutopia_ Grow Your World"
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Or using Bun
bun install
```

### 3. Run Development Server

```bash
# Using npm
npm run dev

# Or using Bun
bun dev
```

Open your browser and navigate to **`http://localhost:3000`** (or the port specified in terminal) to play!

### 4. Build for Production

To build the application and check for compile-time safety:

```bash
npm run build
```

---

## 📁 Folder Structure

```
├── src/
│   ├── components/            # Reusable UI & Game elements
│   │   ├── ui/                # Core interactive UI primitives
│   │   ├── Bloomy.tsx         # Bloomy SVG pixel art configuration
│   │   ├── BloomyChat.tsx     # AI companion coach chat system
│   │   ├── Footer.tsx         # Made with love global footer 🌱
│   │   ├── HUD.tsx            # Heads Up Display (XP, Level, Coins, Streak)
│   │   ├── MissionCard.tsx    # Compact interactive mission checking
│   │   ├── Smogzilla.tsx      # Enemy boss SVG pixel art configuration
│   │   └── WorldScene.tsx     # Dynamic background scenery controller
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # State managers and mission metadata
│   │   ├── game-state.ts      # LocalStorage engine, XP math, & stage rules
│   │   └── missions-data.ts   # Core database of achievements & tasks
│   ├── routes/                # Application page routing
│   │   ├── __root.tsx         # Global page wrapper containing Footer
│   │   ├── app.tsx            # Interactive main game dashboard
│   │   ├── assessment.tsx     # Carbon Footprint calculator quiz
│   │   └── index.tsx          # Landing/Hero page introducing the game
│   ├── styles.css             # CRT filter scanlines & pixel styles
│   └── router.tsx             # TanStack Router configuration
├── package.json               # Config, scripts, and dependencies
└── tsconfig.json              # TypeScript compilation rules
```

---

## 🔮 Future Scope

- 🤝 **Co-op Guilds**: Partner with friends to defeat a colossal mega-Smogzilla collectively.
- 🏪 **Seed Shop**: Spend earned coins to customize Bloomy's garden with unique decorative assets.
- 📱 **Native Apps**: Export using Capacitor/Tauri for iOS and Android pixel-adventures on the go.
- 🔗 **Smart Home Integration**: Connect smart meters to check off energy missions automatically!

---

## ✍️ Author & Credits

- **Concept, Code & Art**: Aditipriya
- Built with love, care & giggles for a greener tomorrow. 🌍✨
- © Aditipriya 2026. All Rights Reserved.
