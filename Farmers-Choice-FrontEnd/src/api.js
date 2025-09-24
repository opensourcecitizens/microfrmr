// Simple API helper for the frontend
const BASE_URL = process.env.API_URL || process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
const AsyncStorage = require('@react-native-async-storage/async-storage').default;

async function authHeaders() {
  const token = await AsyncStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function getItems() {
  const headers = await authHeaders();
  const res = await fetch(`${BASE_URL}/api/items`, { headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch items: ${res.status} ${text}`);
  }
  return res.json();
}

async function getItemById(id) {
  const headers = await authHeaders();
  const res = await fetch(`${BASE_URL}/api/items/${id}`, { headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch item ${id}: ${res.status} ${text}`);
  }
  return res.json();
}

async function createItem(data) {
  const headers = Object.assign({ 'Content-Type': 'application/json' }, await authHeaders());
  const res = await fetch(`${BASE_URL}/api/items`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to create item: ${res.status} ${text}`);
  }
  return res.json();
}

async function updateItem(id, data) {
  const headers = Object.assign({ 'Content-Type': 'application/json' }, await authHeaders());
  const res = await fetch(`${BASE_URL}/api/items/${id}`, {
    method: 'PUT', headers, body: JSON.stringify(data)
  });
  if (!res.ok) { const text = await res.text(); throw new Error(`Failed to update item: ${res.status} ${text}`); }
  return res.json();
}

async function deleteItem(id) {
  const headers = await authHeaders();
  const res = await fetch(`${BASE_URL}/api/items/${id}`, { method: 'DELETE', headers });
  if (!res.ok && res.status !== 204) { const text = await res.text(); throw new Error(`Failed to delete item: ${res.status} ${text}`); }
  return true;
}

async function uploadImage(uri) {
  // uri is local file path from expo-image-picker
  const form = new FormData();
  const filename = uri.split('/').pop();
  const match = /\.([0-9a-z]+)(?:[?#]|$)/i.exec(filename);
  const type = match ? `image/${match[1]}` : 'image';
  form.append('file', { uri, name: filename, type });
  const headers = await authHeaders();
  // Note: do not set Content-Type; let fetch set multipart boundary
  const res = await fetch(`${BASE_URL}/api/uploads`, { method: 'POST', body: form, headers });
  if (!res.ok) { const text = await res.text(); throw new Error(`Upload failed: ${res.status} ${text}`); }
  return res.json();
}

async function getFarms() {
  const headers = await authHeaders();
  const res = await fetch(`${BASE_URL}/api/farms`, { headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch farms: ${res.status} ${text}`);
  }
  return res.json();
}

// Auth helpers
async function register({ name, email, password }) {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) { const text = await res.text(); throw new Error(`Register failed: ${res.status} ${text}`); }
  return res.json();
}

async function login({ email, password }) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }),
  });
  if (!res.ok) { const text = await res.text(); throw new Error(`Login failed: ${res.status} ${text}`); }
  const body = await res.json();
  if (body.token) {
    await AsyncStorage.setItem('token', body.token);
  }
  return body;
}

async function logout() {
  await AsyncStorage.removeItem('token');
}

export default {
  getItems,
  getItemById,
  createItem,
  getFarms,
  register,
  login,
  logout,
  updateItem,
  deleteItem,
  uploadImage,
};
