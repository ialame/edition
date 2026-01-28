<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useBookStore } from '@/stores/books'
import { useAuthStore } from '@/stores/auth'
import BookCard from '@/components/BookCard.vue'
import { BookCategoryLabels } from '@/types'

const bookStore = useBookStore()
const authStore = useAuthStore()

// Récupérer les 4 derniers livres pour la section "Nouveautés"
const featuredBooks = computed(() => {
  return bookStore.books.slice(0, 4)
})

// Statistiques pour la page d'accueil
const stats = computed(() => ({
  totalBooks: bookStore.bookCount,
  categories: Object.keys(bookStore.categoryStats).length
}))

onMounted(() => {
  if (bookStore.books.length === 0) {
    bookStore.fetchBooks()
  }
})
</script>

<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1>Bienvenue aux <span class="highlight">Belles Lettres</span></h1>
        <p class="hero-subtitle">
          Découvrez notre collection de livres classiques et contemporains.
          Une sélection raffinée pour les amoureux de la littérature.
        </p>
        <div class="hero-actions">
          <RouterLink to="/books" class="btn btn-primary btn-lg">
            Explorer le catalogue
          </RouterLink>
          <RouterLink v-if="!authStore.isAuthenticated" to="/login" class="btn btn-outline btn-lg">
            Se connecter
          </RouterLink>
        </div>
      </div>
      <div class="hero-stats">
        <div class="stat-card">
          <span class="stat-number">{{ stats.totalBooks }}</span>
          <span class="stat-label">Livres disponibles</span>
        </div>
        <div class="stat-card">
          <span class="stat-number">{{ stats.categories }}</span>
          <span class="stat-label">Catégories</span>
        </div>
      </div>
    </section>

    <!-- Section Nouveautés -->
    <section class="featured-section">
      <div class="section-header">
        <h2>Nouveautés</h2>
        <RouterLink to="/books" class="link-more">Voir tout →</RouterLink>
      </div>
      
      <div v-if="bookStore.loading" class="loading-container">
        <div class="spinner"></div>
        <p>Chargement des livres...</p>
      </div>

      <div v-else-if="featuredBooks.length === 0" class="empty-state">
        <p>Aucun livre disponible pour le moment.</p>
      </div>

      <div v-else class="books-grid">
        <BookCard 
          v-for="book in featuredBooks" 
          :key="book.id" 
          :book="book" 
        />
      </div>
    </section>

    <!-- Section Catégories -->
    <section class="categories-section">
      <h2>Nos catégories</h2>
      <div class="categories-grid">
        <RouterLink 
          v-for="(label, key) in BookCategoryLabels" 
          :key="key"
          :to="`/books?category=${key}`"
          class="category-card"
        >
          <span class="category-name">{{ label }}</span>
          <span class="category-count">
            {{ bookStore.categoryStats[key] || 0 }} livres
          </span>
        </RouterLink>
      </div>
    </section>

    <!-- Section Admin (si connecté en admin) -->
    <section v-if="authStore.isAdmin" class="admin-section">
      <div class="admin-card">
        <h3>Espace Administrateur</h3>
        <p>Gérez le catalogue de la maison d'édition.</p>
        <RouterLink to="/admin" class="btn btn-secondary">
          Accéder à l'administration
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
}

/* Hero Section */
.hero {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, var(--color-primary-light) 0%, white 100%);
  border-radius: var(--radius-lg);
  margin-bottom: 3rem;
}

.hero h1 {
  font-size: 2.5rem;
  color: var(--color-text);
  margin-bottom: 1rem;
}

.hero .highlight {
  color: var(--color-primary);
}

.hero-subtitle {
  font-size: 1.125rem;
  color: var(--color-text-light);
  max-width: 600px;
  margin: 0 auto 2rem;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-top: 3rem;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-primary);
  font-family: var(--font-heading);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--color-text-light);
}

/* Featured Section */
.featured-section {
  margin-bottom: 3rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 1.75rem;
  color: var(--color-text);
}

.link-more {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
}

.link-more:hover {
  text-decoration: underline;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.loading-container {
  text-align: center;
  padding: 3rem;
  color: var(--color-text-light);
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background: var(--color-bg-light);
  border-radius: var(--radius-md);
  color: var(--color-text-light);
}

/* Categories Section */
.categories-section {
  margin-bottom: 3rem;
}

.categories-section h2 {
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  color: var(--color-text);
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
}

.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: all 0.2s ease;
}

.category-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.category-name {
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.25rem;
}

.category-count {
  font-size: 0.875rem;
  color: var(--color-text-light);
}

/* Admin Section */
.admin-section {
  margin-bottom: 2rem;
}

.admin-card {
  background: linear-gradient(135deg, var(--color-primary) 0%, #1a365d 100%);
  color: white;
  padding: 2rem;
  border-radius: var(--radius-lg);
  text-align: center;
}

.admin-card h3 {
  margin-bottom: 0.5rem;
}

.admin-card p {
  opacity: 0.9;
  margin-bottom: 1.5rem;
}

.admin-card .btn {
  background: white;
  color: var(--color-primary);
}

.admin-card .btn:hover {
  background: var(--color-bg-light);
}

/* Responsive */
@media (max-width: 768px) {
  .hero {
    padding: 2rem 1rem;
  }

  .hero h1 {
    font-size: 1.75rem;
  }

  .hero-stats {
    gap: 2rem;
  }

  .stat-number {
    font-size: 2rem;
  }
}
</style>
