<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookStore } from '@/stores/books'
import BookForm from '@/components/BookForm.vue'
import type { Book } from '@/types'

const props = defineProps<{
  id?: string
}>()

const route = useRoute()
const router = useRouter()
const bookStore = useBookStore()

// Détermine si on est en mode édition
const isEditMode = computed((): boolean => {
  return route.name === 'book-edit' && !!(props.id || route.params.id)
})

const bookId = computed(() => {
  return props.id || route.params.id as string
})

// Titre de la page
const pageTitle = computed(() => {
  return isEditMode.value ? 'Modifier le livre' : 'Ajouter un livre'
})

// Données initiales pour le formulaire
const initialBook = ref<Partial<Book> | undefined>(undefined)
const loadingInitial = ref(false)
const loadError = ref<string | null>(null)

// Charger le livre si mode édition
onMounted(async () => {
  if (isEditMode.value && bookId.value) {
    loadingInitial.value = true
    loadError.value = null
    
    try {
      const book = await bookStore.fetchBook(Number(bookId.value))
      if (book) {
        initialBook.value = { ...book }
      } else {
        loadError.value = 'Livre non trouvé'
      }
    } catch (_err) {
      loadError.value = 'Erreur lors du chargement du livre'
    } finally {
      loadingInitial.value = false
    }
  }
})

// Soumettre le formulaire
async function handleSubmit(bookData: Book) {
  try {
    if (isEditMode.value && bookId.value) {
      // Mise à jour
      await bookStore.updateBook(Number(bookId.value), bookData)
    } else {
      // Création
      await bookStore.createBook(bookData)
    }
    
    // Rediriger vers la page admin
    router.push('/admin')
  } catch (_err) {
    // L'erreur est gérée par le store
    console.error('Erreur lors de la sauvegarde')
  }
}

// Annuler
function handleCancel() {
  router.push('/admin')
}
</script>

<template>
  <div class="book-form-page">
    <header class="page-header">
      <button @click="handleCancel" class="back-link">
        ← Retour à l'administration
      </button>
      <h1>{{ pageTitle }}</h1>
    </header>

    <!-- État de chargement -->
    <div v-if="loadingInitial" class="loading-container">
      <div class="spinner"></div>
      <p>Chargement du livre...</p>
    </div>

    <!-- Erreur de chargement -->
    <div v-else-if="loadError" class="error-container">
      <h2>Erreur</h2>
      <p>{{ loadError }}</p>
      <button @click="handleCancel" class="btn btn-primary">
        Retour à l'administration
      </button>
    </div>

    <!-- Formulaire -->
    <div v-else class="form-container">
      <!-- Message d'erreur du store -->
      <div v-if="bookStore.error" class="alert alert-error">
        {{ bookStore.error }}
        <button @click="bookStore.clearError" class="alert-close">×</button>
      </div>

      <BookForm
        :initial-data="initialBook"
        :is-edit="isEditMode"
        :loading="bookStore.loading"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </div>
  </div>
</template>

<style scoped>
.book-form-page {
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-light);
  text-decoration: none;
  margin-bottom: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  padding: 0;
}

.back-link:hover {
  color: var(--color-primary);
}

.page-header h1 {
  font-size: 2rem;
  color: var(--color-text);
}

/* Loading & Error States */
.loading-container,
.error-container {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.loading-container {
  color: var(--color-text-light);
}

.error-container h2 {
  color: var(--color-error);
  margin-bottom: 0.5rem;
}

.error-container p {
  color: var(--color-text-light);
  margin-bottom: 1.5rem;
}

/* Form Container */
.form-container {
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 2rem;
}

/* Alert */
.alert {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-radius: var(--radius-md);
  margin-bottom: 1.5rem;
}

.alert-error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: var(--color-error);
}

.alert-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: inherit;
  opacity: 0.7;
  padding: 0;
  line-height: 1;
}

.alert-close:hover {
  opacity: 1;
}

/* Responsive */
@media (max-width: 768px) {
  .form-container {
    padding: 1.5rem;
  }

  .page-header h1 {
    font-size: 1.5rem;
  }
}
</style>
