import axios from 'axios';

// In development, we use the proxy defined in vite.config.js
// In production, use the environment variable or fallback to the production API
const API_BASE_URL = import.meta.env.PROD
  ? (import.meta.env.VITE_API_URL || 'https://poetic-server.fly.dev/api')
  : '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication
export const authAPI = {
  signup: (email, username, password) =>
    api.post('/auth/signup', { email, username, password }),
  signin: (email, password) =>
    api.post('/auth/signin', { email, password }),
};

// Poems
export const poemAPI = {
  getAll: () => api.get('/poems'),
  getById: (id) => api.get(`/poems/${id}`),
  create: (title, content, theme, mood, source) =>
    api.post('/poems', { title, content, theme, mood, source }),
  update: (id, title, content, theme, mood) =>
    api.put(`/poems/${id}`, { title, content, theme, mood }),
  delete: (id) => api.delete(`/poems/${id}`),
  like: (id) => api.post(`/poems/${id}/like`),
  unlike: (id) => api.post(`/poems/${id}/unlike`),
  getFollowingFeed: () => api.get('/poems/following'),
};

// Users
export const userAPI = {
  getProfile: (username) => api.get(`/users/${username}`),
  getTrending: () => api.get('/users/trending'),
  getNotifications: () => api.get('/users'),
  markNotificationAsRead: (notificationId) =>
    api.put(`/users/${notificationId}/read`),
  getUnreadCount: () => api.get('/users/notifications/count'),
  searchUsers: (query) => api.get(`/users/search?q=${encodeURIComponent(query)}`),
  updateProfile: (data) => api.patch('/users/profile', data),
  follow: (username) => api.post(`/users/${username}/follow`),
  unfollow: (username) => api.post(`/users/${username}/unfollow`),
  getFollowers: (username) => api.get(`/users/${username}/followers`),
  getFollowing: (username) => api.get(`/users/${username}/following`),
  favoritePoem: (poemId) => api.post(`/users/favorite/${poemId}`),
  unfavoritePoem: (poemId) => api.post(`/users/unfavorite/${poemId}`),
  pinPoem: (poemId) => api.post(`/users/pin/${poemId}`),
  unpinPoem: () => api.post('/users/unpin'),
};

// Poetry DB (for fetching external poems)
const TOPICS = ['love', 'patience', 'wait', 'crush', 'relationship', 'longing', 'heart'];
const MIN_LINES = 4;
const MAX_LINES = 20;

export async function fetchPoem() {
  const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
  const preferredCount = Math.floor(Math.random() * (MAX_LINES - MIN_LINES + 1)) + MIN_LINES;

  try {
    const url = `https://poetrydb.org/lines,linecount/${topic};${preferredCount}`;
    const res = await fetch(url);
    if (!res.ok) return fetchRandomPoem();

    const data = await res.json();

    if (Array.isArray(data) && data.length > 0) {
      const selectedPoem = data[Math.floor(Math.random() * data.length)];
      return normalizePoem(selectedPoem, topic);
    }

    console.warn(`No poems with ${preferredCount} lines for topic ${topic}, trying broad topic search...`);
    const fallbackRes = await fetch(`https://poetrydb.org/lines/${topic}`);
    if (!fallbackRes.ok) return fetchRandomPoem();

    const fallbackData = await fallbackRes.json();
    if (Array.isArray(fallbackData) && fallbackData.length > 0) {
      const filtered = fallbackData.filter(p =>
        p.lines.length >= MIN_LINES && p.lines.length <= MAX_LINES
      );

      if (filtered.length > 0) {
        const selectedPoem = filtered[Math.floor(Math.random() * filtered.length)];
        return normalizePoem(selectedPoem, topic);
      }
    }

    return fetchRandomPoem();
  } catch (err) {
    console.error('API Fetch Error:', err);
    return fetchRandomPoem();
  }
}

async function fetchRandomPoem() {
  try {
    const res = await fetch('https://poetrydb.org/random/20');
    if (!res.ok) throw new Error('Failed to fetch random poems');
    const data = await res.json();

    const suitable = data.find(p => p.lines.length >= MIN_LINES && p.lines.length <= MAX_LINES);
    if (suitable) return normalizePoem(suitable, 'random');

    return normalizePoem(data[0], 'random');
  } catch (err) {
    console.error('Random Fallback Error:', err);
    throw err;
  }
}

function normalizePoem(poemData, topic) {
  return {
    id: `api-${topic}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    title: poemData.title,
    source: poemData.author,
    lines: poemData.lines,
    mood: 'romantic',
    theme: topic
  };
}

export default api;
