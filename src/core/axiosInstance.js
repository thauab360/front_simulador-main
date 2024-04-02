import axios from 'axios';
const process = require('../env');

const instance = axios.create({
  baseURL: process.env.URL, 
  timeout: 15000, 
  headers: {
    'Content-Type': 'application/json'
  }
});

export default instance;