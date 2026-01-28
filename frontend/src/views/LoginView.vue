<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Données du formulaire
const credentials = reactive({
  username: '',
  password: ''
})

// Erreurs de validation
const errors = reactive({
  username: '',
  password: ''
})

const touched = reactive({
  username: false,
  password: false
})

const showPassword = ref(false)

// Validation d'un champ
function validateField(field: 'username' | 'password'): boolean {
  const value = credentials[field]
  
  if (!value || value.trim() === '') {
    errors[field] = field === 'username' 
      ? "Le nom d'utilisateur est requis"
      : "Le mot de passe est requis"
    return false
  }
  
  errors[field] = ''
  return true
}

// Gérer le blur
function handleBlur(field: 'username' | 'password') {
  touched[field] = true
  validateField(field)
}

// Valider tout le formulaire
function validateAll(): boolean {
  touched.username = true
  touched.password = true
  
  const usernameValid = validateField('username')
  const passwordValid = validateField('password')
  
  return usernameValid && passwordValid
}

// Soumission du formulaire
async function handleSubmit() {
  console.log('handleSubmit appelé')
  
  // Valider tous les champs
  if (!validateAll()) {
    console.log('Validation échouée')
    return
  }
  
  console.log('Validation OK, tentative de connexion...')
  
  // Effacer l'erreur précédente
  authStore.clearError()
  
  // Tenter la connexion
  const success = await authStore.login(credentials)
  console.log('Résultat login:', success)
  
  if (success) {
    // Rediriger vers la page demandée ou l'accueil
    const redirect = route.query.redirect as string || '/'
    router.push(redirect)
  }
}

// Toggle visibilité mot de passe
function togglePassword() {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <header class="auth-header">
          <h1>Connexion</h1>
          <p>Connectez-vous pour accéder à votre espace.</p>
        </header>

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
              v-model="credentials.username"
              type="text"
              class="form-input"
              placeholder="Votre nom d'utilisateur"
              autocomplete="username"
              @blur="handleBlur('username')"
              @input="validateField('username')"
            />
            <span v-if="touched.username && errors.username" class="form-error">
              {{ errors.username }}
            </span>
          </div>

          <!-- Mot de passe -->
          <div class="form-group" :class="{ 'has-error': touched.password && errors.password }">
            <label for="password" class="form-label">
              Mot de passe
            </label>
            <div class="password-input-wrapper">
              <input
                id="password"
                v-model="credentials.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                placeholder="Votre mot de passe"
                autocomplete="current-password"
                @blur="handleBlur('password')"
                @input="validateField('password')"
              />
              <button 
                type="button" 
                class="password-toggle"
                @click="togglePassword"
                :title="showPassword ? 'Masquer' : 'Afficher'"
              >
                {{ showPassword ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
            <span v-if="touched.password && errors.password" class="form-error">
              {{ errors.password }}
            </span>
          </div>

          <!-- Bouton de soumission -->
          <button 
            type="submit" 
            class="btn btn-primary btn-block"
            :disabled="authStore.loading"
          >
            <span v-if="authStore.loading" class="spinner-small"></span>
            {{ authStore.loading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>

        <footer class="auth-footer">
          <p>
            Pas encore de compte ?
            <RouterLink to="/register" class="auth-link">
              Créer un compte
            </RouterLink>
          </p>
        </footer>

        <!-- Info comptes de test -->
        <div class="test-accounts">
          <h4>Comptes de test</h4>
          <div class="account-info">
            <p><strong>Admin:</strong> admin / admin123</p>
            <p><strong>Utilisateur:</strong> user / user123</p>
          </div>
        </div>
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

/* Test accounts info */
.test-accounts {
  margin-top: 1.5rem;
  padding: 1rem;
  background: var(--color-bg-light);
  border-radius: var(--radius-md);
  text-align: center;
}

.test-accounts h4 {
  font-size: 0.875rem;
  color: var(--color-text-light);
  margin-bottom: 0.5rem;
}

.account-info {
  font-size: 0.875rem;
}

.account-info p {
  margin: 0.25rem 0;
  color: var(--color-text);
}

/* Alert */
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

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
