// src/utils/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:4000', // Must match your backend server
});

export default instance;
