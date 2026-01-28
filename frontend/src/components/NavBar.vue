<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.isAdmin)
const username = computed(() => authStore.username)

function handleLogout() {
  authStore.logout()
  router.push({ name: 'home' })
}
</script>

<template>
  <nav class="navbar">
    <div class="container navbar-content">
      <RouterLink to="/" class="logo">
        <span class="logo-icon">📚</span>
        <span class="logo-text">Les Belles Lettres</span>
      </RouterLink>

      <div class="nav-links">
        <RouterLink to="/" class="nav-link">Accueil</RouterLink>
        <RouterLink to="/books" class="nav-link">Catalogue</RouterLink>
        
        <template v-if="isAdmin">
          <RouterLink to="/admin" class="nav-link nav-link-admin">
            Administration
          </RouterLink>
        </template>
      </div>

      <div class="nav-auth">
        <template v-if="isAuthenticated">
          <span class="user-info">
            {{ username }}
            <span v-if="isAdmin" class="badge badge-admin">Admin</span>
          </span>
          <button @click="handleLogout" class="btn btn-secondary btn-sm">
            Déconnexion
          </button>
        </template>
        <template v-else>
          <RouterLink to="/login" class="btn btn-secondary btn-sm">
            Connexion
          </RouterLink>
          <RouterLink to="/register" class="btn btn-primary btn-sm">
            Inscription
          </RouterLink>
        </template>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background-color: white;
  box-shadow: var(--shadow-md);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  gap: 2rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--color-primary);
}

.logo-icon {
  font-size: 1.5rem;
}

.logo-text {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 600;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  color: var(--color-text);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.nav-link-admin {
  color: var(--color-secondary);
}

.nav-link-admin:hover,
.nav-link-admin.router-link-active {
  color: var(--color-secondary);
  border-bottom-color: var(--color-secondary);
}

.nav-auth {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: var(--color-text);
}

.badge {
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-admin {
  background-color: var(--color-secondary);
  color: white;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .navbar-content {
    flex-wrap: wrap;
  }
  
  .nav-links {
    order: 3;
    width: 100%;
    justify-content: center;
    padding-top: 1rem;
    border-top: 1px solid var(--color-border);
    margin-top: 1rem;
  }
}
</style>
