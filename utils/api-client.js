import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:3000',
});

client.interceptors.response.use(({ status, data }) => {
  if (status === 401) return status; // Do something
  return data;
});

export default client;
