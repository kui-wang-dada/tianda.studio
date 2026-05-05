import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE ?? 'http://localhost:8000'

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// V2 M1 will add a 401 interceptor here that calls /api/v1/auth/refresh and
// retries the original request once.
