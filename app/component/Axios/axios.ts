/* eslint-disable quote-props */
import axios from 'axios';

// const BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://ghost-jobs-e674172156d1.herokuapp.com/';
// https://theologianspen.com
const BASE_URL = 'https://ghost-jobs-e674172156d1.herokuapp.com/'; 
export const axiosFetch = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// console.log(window.localStorage.getItem('theologianjwt'));
export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  },
  withCredentials: true,
});
