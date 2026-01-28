import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import type { User, LoginCredentials, RegisterCredentials, AuthResponse } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  // ============ STATE ============
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<User | null>(
    JSON.parse(localStorage.getItem('user') || 'null')
  )
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ============ GETTERS ============
  const isAuthenticated = computed(() => !!token.value)
  
  const isAdmin = computed(() => {
    return user.value?.role?.includes('ADMIN') || false
  })
  
  const username = computed(() => user.value?.username || '')
  
  const userRole = computed(() => {
    if (!user.value?.role) return 'Invité'
    return user.value.role.includes('ADMIN') ? 'Administrateur' : 'Utilisateur'
  })

  // ============ ACTIONS ============
  
  /**
   * Connexion de l'utilisateur
   */
  async function login(credentials: LoginCredentials): Promise<boolean> {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials)
      
      // Stocker le token et les infos utilisateur
      token.value = response.data.token
      user.value = {
        username: response.data.username,
        role: response.data.role
      }
      
      // Persister dans le localStorage
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(user.value))
      
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Identifiants incorrects'
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Inscription d'un nouvel utilisateur
   */
  async function register(credentials: RegisterCredentials): Promise<boolean> {
    loading.value = true
    error.value = null
    
    try {
      await api.post('/auth/register', credentials)
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || "Erreur lors de l'inscription"
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Déconnexion
   */
  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  /**
   * Vérifier si le token est toujours valide
   */
  async function checkAuth(): Promise<boolean> {
    if (!token.value) return false
    
    try {
      const response = await api.get('/auth/me')
      user.value = response.data
      localStorage.setItem('user', JSON.stringify(user.value))
      return true
    } catch {
      // Token invalide, nettoyer
      logout()
      return false
    }
  }

  /**
   * Réinitialiser l'erreur
   */
  function clearError() {
    error.value = null
  }

  return {
    // State
    token,
    user,
    loading,
    error,
    // Getters
    isAuthenticated,
    isAdmin,
    username,
    userRole,
    // Actions
    login,
    register,
    logout,
    checkAuth,
    clearError
  }
})
