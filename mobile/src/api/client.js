import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.bearlyapp.com';
console.log('BASE_URL is:', BASE_URL);
async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = await AsyncStorage.getItem('bearly_token');
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Request failed (${res.status})`);
  }
  return res.status === 204 ? null : res.json();
}

export const api = {
  // Auth
  signup: (data) => request('/auth/signup', { method: 'POST', body: data, auth: false }),
  login: (data) => request('/auth/login', { method: 'POST', body: data, auth: false }),

  // Journal
  getJournalEntries: () => request('/journal'),
  createJournalEntry: (data) => request('/journal', { method: 'POST', body: data }),

  // Motivational cards
  sendCard: (data) => request('/cards', { method: 'POST', body: data }),
  getReceivedCards: () => request('/cards/received'),

  // Check-ins with family/friends
  getFriends: () => request('/checkins/friends'),
  sendCheckIn: (data) => request('/checkins', { method: 'POST', body: data }),
  getCheckInFeed: () => request('/checkins/feed'),

  // Companion / wellness tasks
  getCompanion: () => request('/companion'),
  completeTask: (taskType) => request('/companion/tasks/complete', { method: 'POST', body: { taskType } }),

  // Therapist directory & booking
  getTherapists: (query) => request(`/therapists?${new URLSearchParams(query)}`),
  requestSession: (therapistId) => request(`/therapists/${therapistId}/request`, { method: 'POST' }),

  // Crisis resources (no auth needed — must always be reachable)
  getCrisisResources: (countryCode = 'US') =>
    request(`/crisis/resources?country=${countryCode}`, { auth: false }),
};
