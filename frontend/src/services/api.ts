import axios from 'axios'

const api = axios.create({
  baseURL: '/api',  // Utilise le proxy Vite configuré dans vite.config.ts
  headers: {
    'Content-Type': 'application/json'
  }
})

// Intercepteur de requête - ajoute le token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Intercepteur de réponse - gère les erreurs 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      // Rediriger vers la page de login si pas déjà dessus
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?expired=true'
      }
    }
    return Promise.reject(error)
  }
)

export default api
