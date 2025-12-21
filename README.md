# Poem Studio - Frontend

Modern React + Vite application for generating, creating, and sharing poems.

## Features

- ✅ User authentication (sign up / sign in)
- ✅ Generate poems from PoetryDB API
- ✅ Create and save poems to backend database
- ✅ Edit poems (within 10-minute window)
- ✅ Delete poems
- ✅ Share poems as images
- ✅ View all poems collection
- ✅ Responsive design with Tailwind CSS
- ✅ Glass-morphism UI
- ✅ Snowfall animation

## Setup

1. Install dependencies

```bash
npm install
```

2. Create `.env` file with API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

3. Start development server

```bash
npm run dev
```

The app will run on `http://localhost:5173`

## Backend Requirements

This frontend requires the backend API running on `http://localhost:5000`. See the main `SETUP.md` for backend setup instructions.

## Build

```bash
npm run build   # Build for production
npm run preview # Preview production build
```

## Key Components

- **Header** - Navigation and user profile
- **SignUp / SignIn** - Authentication forms
- **PoemGenerator** - Generate and save poems
- **PoemList** - Display all poems with edit/delete
- **PoemCard** - Individual poem display
- **AuthContext** - Global auth state management

## API Integration

The app communicates with backend via RESTful API:

- `/api/auth/signup` - User registration
- `/api/auth/signin` - User login
- `/api/poems` - CRUD operations for poems

All requests include JWT token in Authorization header for authenticated endpoints.

## Authentication

- Tokens stored in localStorage
- Automatically included in API requests
- 7-day token expiration

## Development

See `SETUP.md` in the root directory for full stack setup instructions.
npm run build
npm run preview
```

Notes

- The project uses Vite + React + Tailwind. It stores saved poems in `localStorage` under `poem_studio_saved`.
- Feel free to add more base poems in `src/data/poems.js` and tweak styles in `src/styles/index.css`.
