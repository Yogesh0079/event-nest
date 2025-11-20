import axios from 'axios';

export const apiClient = axios.create({
 baseURL: "https://event-nest-backend.vercel.app/",
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function fetchFeaturedEvents(limit = 3) {
  const { data } = await apiClient.get('/events');
  return Array.isArray(data) ? data.slice(0, limit) : [];
}

export async function fetchEvents(params = {}) {
  const { data } = await apiClient.get('/events', { params });
  return Array.isArray(data) ? data : [];
}

export async function fetchEvent(id) {
  try {
    const { data } = await apiClient.get(`/events/${id}`);
    return data;
  } catch {
    return null;
  }
}
