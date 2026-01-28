<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Données du formulaire
const formData = reactive({
  username: '',
  password: '',
  confirmPassword: ''
})

// Message de succès
const successMessage = ref('')

// Erreurs de validation
const errors = reactive({
  username: '',
  password: '',
  confirmPassword: ''
})

const touched = reactive({
  username: false,
  password: false,
  confirmPassword: false
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Validation d'un champ
function validateField(field: 'username' | 'password' | 'confirmPassword'): boolean {
  const value = formData[field]
  
  if (field === 'username') {
    if (!value || value.trim() === '') {
      errors.username = "Le nom d'utilisateur est requis"
      return false
    }
    if (value.length < 3) {
      errors.username = 'Minimum 3 caractères'
      return false
    }
    if (value.length > 20) {
      errors.username = 'Maximum 20 caractères'
      return false
    }
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      errors.username = 'Lettres, chiffres et _ uniquement'
      return false
    }
    errors.username = ''
    return true
  }
  
  if (field === 'password') {
    if (!value || value.trim() === '') {
      errors.password = 'Le mot de passe est requis'
      return false
    }
    if (value.length < 6) {
      errors.password = 'Minimum 6 caractères'
      return false
    }
    errors.password = ''
    return true
  }
  
  if (field === 'confirmPassword') {
    if (!value || value.trim() === '') {
      errors.confirmPassword = 'Veuillez confirmer le mot de passe'
      return false
    }
    if (value !== formData.password) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas'
      return false
    }
    errors.confirmPassword = ''
    return true
  }
  
  return true
}

// Gérer le blur
function handleBlur(field: 'username' | 'password' | 'confirmPassword') {
  touched[field] = true
  validateField(field)
}

// Valider tout le formulaire
function validateAll(): boolean {
  touched.username = true
  touched.password = true
  touched.confirmPassword = true
  
  const usernameValid = validateField('username')
  const passwordValid = validateField('password')
  const confirmValid = validateField('confirmPassword')
  
  return usernameValid && passwordValid && confirmValid
}

// Soumission du formulaire
async function handleSubmit() {
  // Valider tous les champs
  if (!validateAll()) return
  
  // Effacer les messages précédents
  authStore.clearError()
  successMessage.value = ''
  
  // Tenter l'inscription
  const success = await authStore.register({
    username: formData.username,
    password: formData.password
  })
  
  if (success) {
    successMessage.value = 'Compte créé avec succès ! Redirection vers la connexion...'
    
    // Rediriger vers la page de connexion après 2 secondes
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <header class="auth-header">
          <h1>Inscription</h1>
          <p>Créez votre compte pour accéder à l'espace utilisateur.</p>
        </header>

        <!-- Message de succès -->
        <div v-if="successMessage" class="alert alert-success">
          {{ successMessage }}
        </div>

        <!-- Message d'erreur global -->
        <div v-if="authStore.error" class="alert alert-error">
          {{ authStore.error }}
        </div>

        <form @submit.prevent="handleSubmit" class="auth-form" novalidate>
          <!-- Nom d'utilisateur -->
          <div class="form-group" :class="{ 'has-error': touched.username && errors.username }">
            <label for="username" class="form-label">
              Nom d'utilisateur
            </label>
            <input
              id="username"
              v-model="formData.username"
              type="text"
              class="form-input"
              placeholder="Choisissez un nom d'utilisateur"
              autocomplete="username"
              @blur="handleBlur('username')"
              @input="validateField('username')"
            />
            <span v-if="touched.username && errors.username" class="form-error">
              {{ errors.username }}
            </span>
            <span class="form-hint">3-20 caractères : lettres, chiffres, _</span>
          </div>

          <!-- Mot de passe -->
          <div class="form-group" :class="{ 'has-error': touched.password && errors.password }">
            <label for="password" class="form-label">
              Mot de passe
            </label>
            <div class="password-input-wrapper">
              <input
                id="password"
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                placeholder="Choisissez un mot de passe"
                autocomplete="new-password"
                @blur="handleBlur('password')"
                @input="validateField('password')"
              />
              <button 
                type="button" 
                class="password-toggle"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
            <span v-if="touched.password && errors.password" class="form-error">
              {{ errors.password }}
            </span>
            <span class="form-hint">Minimum 6 caractères</span>
          </div>

          <!-- Confirmation mot de passe -->
          <div class="form-group" :class="{ 'has-error': touched.confirmPassword && errors.confirmPassword }">
            <label for="confirmPassword" class="form-label">
              Confirmer le mot de passe
            </label>
            <div class="password-input-wrapper">
              <input
                id="confirmPassword"
                v-model="formData.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                class="form-input"
                placeholder="Confirmez votre mot de passe"
                autocomplete="new-password"
                @blur="handleBlur('confirmPassword')"
                @input="validateField('confirmPassword')"
              />
              <button 
                type="button" 
                class="password-toggle"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                {{ showConfirmPassword ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
            <span v-if="touched.confirmPassword && errors.confirmPassword" class="form-error">
              {{ errors.confirmPassword }}
            </span>
          </div>

          <!-- Bouton de soumission -->
          <button 
            type="submit" 
            class="btn btn-primary btn-block"
            :disabled="authStore.loading"
          >
            <span v-if="authStore.loading" class="spinner-small"></span>
            {{ authStore.loading ? 'Création...' : 'Créer mon compte' }}
          </button>
        </form>

        <footer class="auth-footer">
          <p>
            Déjà un compte ?
            <RouterLink to="/login" class="auth-link">
              Se connecter
            </RouterLink>
          </p>
        </footer>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.auth-container {
  width: 100%;
  max-width: 420px;
}

.auth-card {
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-md);
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-header h1 {
  font-size: 1.75rem;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.auth-header p {
  color: var(--color-text-light);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Form hint */
.form-hint {
  display: block;
  font-size: 0.75rem;
  color: var(--color-text-light);
  margin-top: 0.25rem;
}

/* Password input wrapper */
.password-input-wrapper {
  position: relative;
}

.password-input-wrapper .form-input {
  padding-right: 3rem;
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  font-size: 1rem;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.password-toggle:hover {
  opacity: 1;
}

/* Bouton block */
.btn-block {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.spinner-small {
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* Footer */
.auth-footer {
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
}

.auth-footer p {
  color: var(--color-text-light);
}

.auth-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
}

.auth-link:hover {
  text-decoration: underline;
}

/* Alerts */
.alert {
  padding: 1rem;
  border-radius: var(--radius-md);
  margin-bottom: 1rem;
}

.alert-error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: var(--color-error);
}

.alert-success {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #166534;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
