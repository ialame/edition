<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useBookStore } from '@/stores/books'
import { useAuthStore } from '@/stores/auth'
import { BookCategoryLabels } from '@/types'

const props = defineProps<{
  id?: string
}>()

const route = useRoute()
const router = useRouter()
const bookStore = useBookStore()
const authStore = useAuthStore()

// Récupérer l'ID depuis les props ou la route
const bookId = computed(() => {
  return props.id || route.params.id as string
})

// Le livre courant
const book = computed(() => bookStore.currentBook)

// Label de la catégorie
const categoryLabel = computed(() => {
  if (!book.value) return ''
  return BookCategoryLabels[book.value.category] || book.value.category
})

// Prix formaté
const formattedPrice = computed(() => {
  if (!book.value) return ''
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(book.value.price)
})

// Charger le livre
onMounted(async () => {
  if (bookId.value) {
    await bookStore.fetchBook(Number(bookId.value))
  }
})

// Suppression du livre
async function handleDelete() {
  if (!book.value?.id) return
  
  if (confirm(`Êtes-vous sûr de vouloir supprimer "${book.value.title}" ?`)) {
    const success = await bookStore.deleteBook(book.value.id)
    if (success) {
      router.push('/books')
    }
  }
}

// Retour à la liste
function goBack() {
  router.back()
}
</script>

<template>
  <div class="book-detail-page">
    <!-- Bouton retour -->
    <button @click="goBack" class="back-link">
      ← Retour
    </button>

    <!-- État de chargement -->
    <div v-if="bookStore.loading" class="loading-container">
      <div class="spinner"></div>
      <p>Chargement du livre...</p>
    </div>

    <!-- Erreur ou livre non trouvé -->
    <div v-else-if="!book" class="error-container">
      <h2>Livre non trouvé</h2>
      <p>Le livre demandé n'existe pas ou a été supprimé.</p>
      <RouterLink to="/books" class="btn btn-primary">
        Retour au catalogue
      </RouterLink>
    </div>

    <!-- Détail du livre -->
    <article v-else class="book-detail">
      <div class="book-layout">
        <!-- Image de couverture -->
        <div class="book-cover-section">
          <div class="book-cover">
            <img 
              v-if="book.coverUrl" 
              :src="book.coverUrl" 
              :alt="`Couverture de ${book.title}`"
              class="cover-image"
            />
            <div v-else class="cover-placeholder">
              <span class="placeholder-icon">📖</span>
              <span class="placeholder-text">{{ book.title.charAt(0) }}</span>
            </div>
          </div>
          
          <!-- Badge catégorie -->
          <span class="category-badge">{{ categoryLabel }}</span>
        </div>

        <!-- Informations du livre -->
        <div class="book-info">
          <header class="book-header">
            <h1>{{ book.title }}</h1>
            <p class="book-author">par <strong>{{ book.author }}</strong></p>
          </header>

          <div class="book-meta">
            <div class="meta-item">
              <span class="meta-label">ISBN</span>
              <span class="meta-value">{{ book.isbn }}</span>
            </div>
            <div v-if="book.publicationYear" class="meta-item">
              <span class="meta-label">Année de publication</span>
              <span class="meta-value">{{ book.publicationYear }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Prix</span>
              <span class="meta-value price">{{ formattedPrice }}</span>
            </div>
          </div>

          <div v-if="book.description" class="book-description">
            <h2>Description</h2>
            <p>{{ book.description }}</p>
          </div>

          <!-- Actions Admin -->
          <div v-if="authStore.isAdmin" class="admin-actions">
            <RouterLink 
              :to="`/admin/books/${book.id}/edit`" 
              class="btn btn-primary"
            >
              ✏️ Modifier
            </RouterLink>
            <button @click="handleDelete" class="btn btn-danger">
              🗑️ Supprimer
            </button>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>

<style scoped>
.book-detail-page {
  max-width: 1000px;
  margin: 0 auto;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-light);
  text-decoration: none;
  margin-bottom: 2rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
}

.back-link:hover {
  color: var(--color-primary);
}

/* Loading & Error States */
.loading-container,
.error-container {
  text-align: center;
  padding: 4rem 2rem;
}

.error-container {
  background: var(--color-bg-light);
  border-radius: var(--radius-lg);
}

.error-container h2 {
  margin-bottom: 0.5rem;
}

.error-container p {
  color: var(--color-text-light);
  margin-bottom: 1.5rem;
}

/* Book Detail Layout */
.book-detail {
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.book-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  padding: 2rem;
}

/* Cover Section */
.book-cover-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.book-cover {
  width: 100%;
  aspect-ratio: 2/3;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
}

.placeholder-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.placeholder-text {
  font-size: 4rem;
  font-family: var(--font-heading);
  font-weight: 700;
}

.category-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-full);
  font-size: 0.875rem;
  font-weight: 500;
}

/* Book Info */
.book-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.book-header h1 {
  font-size: 2rem;
  color: var(--color-text);
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.book-author {
  font-size: 1.125rem;
  color: var(--color-text-light);
}

.book-author strong {
  color: var(--color-text);
}

/* Meta Information */
.book-meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  padding: 1.5rem;
  background: var(--color-bg-light);
  border-radius: var(--radius-md);
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.meta-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-light);
}

.meta-value {
  font-weight: 600;
  color: var(--color-text);
}

.meta-value.price {
  font-size: 1.25rem;
  color: var(--color-primary);
}

/* Description */
.book-description h2 {
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
  color: var(--color-text);
}

.book-description p {
  color: var(--color-text-light);
  line-height: 1.7;
}

/* Admin Actions */
.admin-actions {
  display: flex;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
  margin-top: auto;
}

/* Responsive */
@media (max-width: 768px) {
  .book-layout {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 1.5rem;
  }

  .book-cover-section {
    max-width: 250px;
    margin: 0 auto;
  }

  .book-header h1 {
    font-size: 1.5rem;
  }

  .admin-actions {
    flex-direction: column;
  }
}
</style>
