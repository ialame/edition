<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useBookStore } from '@/stores/books'
import { useAuthStore } from '@/stores/auth'
import { BookCategoryLabels, BookCategory } from '@/types'

const bookStore = useBookStore()
const authStore = useAuthStore()

// État local pour la gestion
const deleteConfirmId = ref<number | null>(null)
const deleteLoading = ref(false)

// Statistiques
const stats = computed(() => ({
  totalBooks: bookStore.bookCount,
  categories: bookStore.categoryStats,
  categoriesCount: Object.keys(bookStore.categoryStats).length
}))

// Charger les livres
onMounted(() => {
  bookStore.fetchBooks()
})

// Gestion de la suppression
function confirmDelete(bookId: number) {
  deleteConfirmId.value = bookId
}

function cancelDelete() {
  deleteConfirmId.value = null
}

async function executeDelete(bookId: number) {
  deleteLoading.value = true
  try {
    await bookStore.deleteBook(bookId)
  } finally {
    deleteLoading.value = false
    deleteConfirmId.value = null
  }
}

// Formater le prix
function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}
</script>

<template>
  <div class="admin-page">
    <header class="page-header">
      <div class="header-content">
        <h1>Administration</h1>
        <p>Bienvenue, <strong>{{ authStore.username }}</strong> ({{ authStore.userRole }})</p>
      </div>
      <RouterLink to="/admin/books/new" class="btn btn-primary">
        + Ajouter un livre
      </RouterLink>
    </header>

    <!-- Statistiques -->
    <section class="stats-section">
      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-value">{{ stats.totalBooks }}</span>
          <span class="stat-label">Livres au catalogue</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ stats.categoriesCount }}</span>
          <span class="stat-label">Catégories actives</span>
        </div>
        <div 
          v-for="(count, category) in stats.categories" 
          :key="category"
          class="stat-card stat-card-small"
        >
          <span class="stat-value">{{ count }}</span>
          <span class="stat-label">{{ BookCategoryLabels[category as BookCategory] }}</span>
        </div>
      </div>
    </section>

    <!-- Liste des livres -->
    <section class="books-section">
      <div class="section-header">
        <h2>Gestion des livres</h2>
        <span class="count-badge">{{ bookStore.books.length }} livre(s)</span>
      </div>

      <!-- État de chargement -->
      <div v-if="bookStore.loading" class="loading-container">
        <div class="spinner"></div>
        <p>Chargement...</p>
      </div>

      <!-- Liste vide -->
      <div v-else-if="bookStore.books.length === 0" class="empty-state">
        <p>Aucun livre dans le catalogue.</p>
        <RouterLink to="/admin/books/new" class="btn btn-primary">
          Ajouter le premier livre
        </RouterLink>
      </div>

      <!-- Tableau des livres -->
      <div v-else class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Auteur</th>
              <th>ISBN</th>
              <th>Catégorie</th>
              <th>Prix</th>
              <th class="actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="book in bookStore.books" :key="book.id">
              <td class="title-cell">
                <RouterLink :to="`/books/${book.id}`" class="book-link">
                  {{ book.title }}
                </RouterLink>
              </td>
              <td>{{ book.author }}</td>
              <td class="isbn-cell">{{ book.isbn }}</td>
              <td>
                <span class="category-tag">
                  {{ BookCategoryLabels[book.category] }}
                </span>
              </td>
              <td class="price-cell">{{ formatPrice(book.price) }}</td>
              <td class="actions-cell">
                <!-- Mode normal -->
                <template v-if="deleteConfirmId !== book.id">
                  <RouterLink 
                    :to="`/admin/books/${book.id}/edit`" 
                    class="btn btn-small btn-ghost"
                    title="Modifier"
                  >
                    ✏️
                  </RouterLink>
                  <button 
                    @click="confirmDelete(book.id!)" 
                    class="btn btn-small btn-ghost btn-danger-ghost"
                    title="Supprimer"
                  >
                    🗑️
                  </button>
                </template>
                
                <!-- Mode confirmation -->
                <template v-else>
                  <div class="delete-confirm">
                    <span>Confirmer ?</span>
                    <button 
                      @click="executeDelete(book.id!)" 
                      class="btn btn-small btn-danger"
                      :disabled="deleteLoading"
                    >
                      {{ deleteLoading ? '...' : 'Oui' }}
                    </button>
                    <button 
                      @click="cancelDelete" 
                      class="btn btn-small btn-ghost"
                    >
                      Non
                    </button>
                  </div>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<style scoped>
.admin-page {
  max-width: 1200px;
  margin: 0 auto;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-content h1 {
  font-size: 2rem;
  color: var(--color-text);
  margin-bottom: 0.25rem;
}

.header-content p {
  color: var(--color-text-light);
}

/* Stats Section */
.stats-section {
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  text-align: center;
}

.stat-card-small {
  padding: 1rem;
}

.stat-value {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-primary);
  font-family: var(--font-heading);
}

.stat-card-small .stat-value {
  font-size: 1.5rem;
}

.stat-label {
  display: block;
  font-size: 0.875rem;
  color: var(--color-text-light);
  margin-top: 0.25rem;
}

/* Books Section */
.books-section {
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.section-header h2 {
  font-size: 1.25rem;
  color: var(--color-text);
}

.count-badge {
  font-size: 0.875rem;
  padding: 0.25rem 0.75rem;
  background: var(--color-bg-light);
  border-radius: var(--radius-full);
  color: var(--color-text-light);
}

/* Loading & Empty */
.loading-container,
.empty-state {
  text-align: center;
  padding: 3rem;
}

.loading-container {
  color: var(--color-text-light);
}

/* Table */
.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 1rem 1.5rem;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

.data-table th {
  background: var(--color-bg-light);
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--color-text-light);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.data-table tbody tr:hover {
  background: var(--color-bg-light);
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

.title-cell {
  max-width: 250px;
}

.book-link {
  color: var(--color-text);
  text-decoration: none;
  font-weight: 500;
}

.book-link:hover {
  color: var(--color-primary);
}

.isbn-cell {
  font-family: monospace;
  font-size: 0.875rem;
  color: var(--color-text-light);
}

.price-cell {
  font-weight: 600;
  color: var(--color-primary);
}

.category-tag {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
}

.actions-col {
  width: 150px;
  text-align: right;
}

.actions-cell {
  text-align: right;
  white-space: nowrap;
}

.btn-small {
  padding: 0.375rem 0.5rem;
  font-size: 0.875rem;
}

.btn-danger-ghost {
  color: var(--color-error);
}

.btn-danger-ghost:hover {
  background: #fef2f2;
}

/* Delete confirmation */
.delete-confirm {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: flex-end;
}

.delete-confirm span {
  font-size: 0.875rem;
  color: var(--color-text-light);
}

/* Responsive */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .data-table th,
  .data-table td {
    padding: 0.75rem 1rem;
  }

  .data-table th:nth-child(3),
  .data-table td:nth-child(3) {
    display: none; /* Masquer ISBN sur mobile */
  }
}
</style>
