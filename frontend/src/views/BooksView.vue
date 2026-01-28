<script setup lang="ts">
import { onMounted, watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookStore } from '@/stores/books'
import BookCard from '@/components/BookCard.vue'
import { BookCategory, BookCategoryLabels } from '@/types'

const route = useRoute()
const router = useRouter()
const bookStore = useBookStore()

const localSearch = ref('')

// Initialisation et synchronisation avec l'URL
onMounted(() => {
  bookStore.fetchBooks()
  
  // Appliquer les filtres depuis l'URL
  if (route.query.category) {
    bookStore.setCategory(route.query.category as BookCategory)
  }
  if (route.query.search) {
    localSearch.value = route.query.search as string
    bookStore.setSearchQuery(localSearch.value)
  }
})

// Synchroniser la recherche avec le store (avec debounce manuel)
let searchTimeout: ReturnType<typeof setTimeout> | undefined
watch(localSearch, (newValue) => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    bookStore.setSearchQuery(newValue)
    updateUrl()
  }, 300)
})

// Gérer le changement de catégorie
function handleCategoryChange(category: BookCategory | null) {
  bookStore.setCategory(category)
  updateUrl()
}

// Mettre à jour l'URL avec les filtres
function updateUrl() {
  const query: Record<string, string> = {}
  if (bookStore.searchQuery) query.search = bookStore.searchQuery
  if (bookStore.selectedCategory) query.category = bookStore.selectedCategory
  
  router.replace({ query })
}

// Réinitialiser tous les filtres
function clearAllFilters() {
  localSearch.value = ''
  bookStore.clearFilters()
  router.replace({ query: {} })
}
</script>

<template>
  <div class="books-page">
    <header class="page-header">
      <h1>Catalogue</h1>
      <p class="page-subtitle">
        {{ bookStore.filteredCount }} livre{{ bookStore.filteredCount > 1 ? 's' : '' }}
        <span v-if="bookStore.searchQuery || bookStore.selectedCategory">
          (filtrés sur {{ bookStore.bookCount }} au total)
        </span>
      </p>
    </header>

    <!-- Barre de filtres -->
    <div class="filters-bar">
      <div class="search-box">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="M21 21l-4.35-4.35"/>
        </svg>
        <input
          v-model="localSearch"
          type="text"
          placeholder="Rechercher par titre, auteur ou ISBN..."
          class="search-input"
        />
      </div>

      <div class="filter-group">
        <label class="filter-label">Catégorie :</label>
        <select 
          :value="bookStore.selectedCategory || ''" 
          @change="handleCategoryChange(($event.target as HTMLSelectElement).value as BookCategory || null)"
          class="filter-select"
        >
          <option value="">Toutes les catégories</option>
          <option v-for="(label, key) in BookCategoryLabels" :key="key" :value="key">
            {{ label }} ({{ bookStore.categoryStats[key] || 0 }})
          </option>
        </select>
      </div>

      <button 
        v-if="bookStore.searchQuery || bookStore.selectedCategory"
        @click="clearAllFilters"
        class="btn btn-ghost"
      >
        ✕ Effacer les filtres
      </button>
    </div>

    <!-- État de chargement -->
    <div v-if="bookStore.loading" class="loading-container">
      <div class="spinner"></div>
      <p>Chargement du catalogue...</p>
    </div>

    <!-- Message d'erreur -->
    <div v-else-if="bookStore.error" class="error-container">
      <p class="error-message">{{ bookStore.error }}</p>
      <button @click="bookStore.fetchBooks()" class="btn btn-primary">
        Réessayer
      </button>
    </div>

    <!-- Aucun résultat -->
    <div v-else-if="bookStore.filteredBooks.length === 0" class="empty-state">
      <div class="empty-icon">📚</div>
      <h3>Aucun livre trouvé</h3>
      <p v-if="bookStore.searchQuery || bookStore.selectedCategory">
        Essayez de modifier vos critères de recherche.
      </p>
      <p v-else>
        Le catalogue est vide pour le moment.
      </p>
      <button 
        v-if="bookStore.searchQuery || bookStore.selectedCategory"
        @click="clearAllFilters" 
        class="btn btn-primary"
      >
        Voir tous les livres
      </button>
    </div>

    <!-- Grille de livres -->
    <div v-else class="books-grid">
      <BookCard 
        v-for="book in bookStore.filteredBooks" 
        :key="book.id" 
        :book="book"
      />
    </div>
  </div>
</template>

<style scoped>
.books-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: var(--color-text-light);
}

/* Filters Bar */
.filters-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  margin-bottom: 2rem;
}

.search-box {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 250px;
  background: var(--color-bg-light);
  border-radius: var(--radius-md);
  padding: 0 1rem;
}

.search-icon {
  width: 20px;
  height: 20px;
  color: var(--color-text-light);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 0.75rem;
  font-size: 1rem;
  outline: none;
}

.search-input::placeholder {
  color: var(--color-text-light);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-label {
  font-size: 0.875rem;
  color: var(--color-text-light);
  white-space: nowrap;
}

.filter-select {
  padding: 0.5rem 2rem 0.5rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: white;
  font-size: 0.875rem;
  cursor: pointer;
  outline: none;
}

.filter-select:focus {
  border-color: var(--color-primary);
}

/* Loading & Empty States */
.loading-container,
.empty-state,
.error-container {
  text-align: center;
  padding: 4rem 2rem;
}

.loading-container {
  color: var(--color-text-light);
}

.empty-state {
  background: var(--color-bg-light);
  border-radius: var(--radius-lg);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: var(--color-text-light);
  margin-bottom: 1.5rem;
}

.error-container {
  background: #fef2f2;
  border-radius: var(--radius-lg);
}

.error-message {
  color: var(--color-error);
  margin-bottom: 1rem;
}

/* Books Grid */
.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

/* Responsive */
@media (max-width: 768px) {
  .filters-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    min-width: unset;
  }

  .filter-group {
    justify-content: space-between;
  }

  .filter-select {
    flex: 1;
  }
}
</style>
