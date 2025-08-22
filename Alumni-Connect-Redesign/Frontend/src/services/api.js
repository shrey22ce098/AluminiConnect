import axios from 'axios';

const API_BASE = 'http://localhost:5000'; // Changed to match backend port

export const fetchEvents = async (token) => {
  return axios.get(`${API_BASE}/event/all`, {
    withCredentials: true,
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createEvent = async (eventData, token) => {
  return axios.post(`${API_BASE}/event/create`, eventData, {
    withCredentials: true,
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const fetchMeetings = async (token) => {
  return axios.get(`${API_BASE}/meeting`, {
    withCredentials: true,
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createMeeting = async (meetingData, token) => {
  return axios.post(`${API_BASE}/meeting`, meetingData, {
    withCredentials: true,
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const bulkImport = async (formData, token) => {
  return axios.post(`${API_BASE}/bulkImport`, formData, {
    withCredentials: true,
    headers: { Authorization: `Bearer ${token}` },
  });
};
