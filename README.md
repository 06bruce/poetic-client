# Poem Studio

Modern React app that generates and displays famous and underrated poems inspired by books and life.

Features:
- Generate poems programmatically from curated local data
- Famous and Underrated categories
- Save previous poems (persisted to `localStorage`)
- Like, copy, and delete poems
- Soft glassmorphism cards with dimmed dark backgrounds
- Snowfall animation with toggle

Setup

1. Install dependencies

```bash
cd /home/bruce-nshuti/Documents/Poems
npm install
```

2. Run dev server

```bash
npm run dev
```

Build

```bash
npm run build
npm run preview
```

Notes

- The project uses Vite + React + Tailwind. It stores saved poems in `localStorage` under `poem_studio_saved`.
- Feel free to add more base poems in `src/data/poems.js` and tweak styles in `src/styles/index.css`.
