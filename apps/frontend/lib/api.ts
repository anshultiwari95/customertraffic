import axios from 'axios';

const API_BASE = 'http://localhost:4000/api';

export async function fetchLiveData() {
  const response = await axios.get(`${API_BASE}/live`);
  return response.data;
}

export async function fetchHistoryData() {
  const response = await axios.get(`${API_BASE}/history`);
  return response.data;
}
