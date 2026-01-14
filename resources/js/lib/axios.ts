import axios from 'axios'
import {useSelector} from 'react-redux'

const api = axios.create({
  baseURL: 'http://localhost:8000/',
  withCredentials: true,
  headers: {
    Accept: "application/json"
  }
});

export default api;

