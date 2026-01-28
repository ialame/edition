<script setup lang="ts">
import { watch, onMounted } from 'vue'
import { useValidation, validationRules } from '@/composables/useValidation'
import type { Book } from '@/types'
import { BookCategory, BookCategoryLabels } from '@/types'

const props = defineProps<{
  initialData?: Partial<Book>
  isEdit?: boolean
  loading?: boolean
}>()

const emit = defineEmits<{
  submit: [book: Book]
  cancel: []
}>()

// Liste des catégories pour le select
const categories = Object.values(BookCategory)

// Données initiales du formulaire
const initialBook: Book = {
  title: '',
  author: '',
  isbn: '',
  price: 0,
  description: '',
  coverUrl: '',
  publicationYear: new Date().getFullYear(),
  category: BookCategory.ROMAN
}

// Règles de validation
const rules = {
  title: [
    validationRules.required('Le titre est obligatoire'),
    validationRules.minLength(2, 'Le titre doit avoir au moins 2 caractères'),
    validationRules.maxLength(200, 'Le titre ne peut pas dépasser 200 caractères')
  ],
  author: [
    validationRules.required("Le nom de l'auteur est obligatoire"),
    validationRules.minLength(2, 'Le nom doit avoir au moins 2 caractères'),
    validationRules.maxLength(100, 'Le nom ne peut pas dépasser 100 caractères')
  ],
  isbn: [
    validationRules.required("L'ISBN est obligatoire"),
    validationRules.isbn()
  ],
  price: [
    validationRules.required('Le prix est obligatoire'),
    validationRules.positiveNumber('Le prix doit être positif')
  ],
  publicationYear: [
    validationRules.year("Année de publication invalide")
  ],
  description: [
    validationRules.maxLength(1000, 'La description ne peut pas dépasser 1000 caractères')
  ],
  coverUrl: [
    validationRules.url("L'URL de la couverture est invalide")
  ]
}

// Utiliser le composable de validation
const {
  formData,
  errors,
  validateAll,
  handleBlur,
  handleInput,
  resetForm,
  setFormData,
  hasError,
  getFormData
} = useValidation(initialBook, rules)

// Charger les données du livre si en mode édition
onMounted(() => {
  if (props.initialData) {
    setFormData({ ...initialBook, ...props.initialData })
  }
})

// Surveiller les changements du prop initialData
watch(() => props.initialData, (newData: Partial<Book> | undefined) => {
  if (newData) {
    setFormData({ ...initialBook, ...newData })
  }
}, { deep: true })

// Soumettre le formulaire
function handleSubmit() {
  if (validateAll()) {
    emit('submit', getFormData())
  }
}

// Annuler
function handleCancel() {
  resetForm()
  emit('cancel')
}

// Helper pour obtenir le label de la catégorie
function getCategoryLabel(category: BookCategory): string {
  return BookCategoryLabels[category] || category
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="book-form">
    <!-- Titre -->
    <div class="form-group" :class="{ error: hasError('title') }">
      <label for="title">Titre *</label>
      <input
        id="title"
        v-model="formData.title"
        type="text"
        @blur="handleBlur('title')"
        @input="handleInput('title')"
        placeholder="Ex: Les Fleurs du Mal"
      />
      <span v-if="hasError('title')" class="error-message">
        {{ errors.title }}
      </span>
    </div>

    <!-- Auteur -->
    <div class="form-group" :class="{ error: hasError('author') }">
      <label for="author">Auteur *</label>
      <input
        id="author"
        v-model="formData.author"
        type="text"
        @blur="handleBlur('author')"
        @input="handleInput('author')"
        placeholder="Ex: Charles Baudelaire"
      />
      <span v-if="hasError('author')" class="error-message">
        {{ errors.author }}
      </span>
    </div>

    <!-- ISBN et Prix -->
    <div class="form-row">
      <div class="form-group" :class="{ error: hasError('isbn') }">
        <label for="isbn">ISBN *</label>
        <input
          id="isbn"
          v-model="formData.isbn"
          type="text"
          @blur="handleBlur('isbn')"
          @input="handleInput('isbn')"
          placeholder="978-XXXXXXXXXX"
        />
        <span v-if="hasError('isbn')" class="error-message">
          {{ errors.isbn }}
        </span>
      </div>

      <div class="form-group" :class="{ error: hasError('price') }">
        <label for="price">Prix (EUR) *</label>
        <input
          id="price"
          v-model.number="formData.price"
          type="number"
          step="0.01"
          min="0"
          @blur="handleBlur('price')"
          @input="handleInput('price')"
        />
        <span v-if="hasError('price')" class="error-message">
          {{ errors.price }}
        </span>
      </div>
    </div>

    <!-- Catégorie et Année -->
    <div class="form-row">
      <div class="form-group">
        <label for="category">Catégorie *</label>
        <select id="category" v-model="formData.category">
          <option v-for="cat in categories" :key="cat" :value="cat">
            {{ getCategoryLabel(cat) }}
          </option>
        </select>
      </div>

      <div class="form-group" :class="{ error: hasError('publicationYear') }">
        <label for="year">Année de publication</label>
        <input
          id="year"
          v-model.number="formData.publicationYear"
          type="number"
          min="1450"
          :max="new Date().getFullYear() + 1"
          @blur="handleBlur('publicationYear')"
          @input="handleInput('publicationYear')"
        />
        <span v-if="hasError('publicationYear')" class="error-message">
          {{ errors.publicationYear }}
        </span>
      </div>
    </div>

    <!-- Description -->
    <div class="form-group" :class="{ error: hasError('description') }">
      <label for="description">Description</label>
      <textarea
        id="description"
        v-model="formData.description"
        rows="4"
        @blur="handleBlur('description')"
        @input="handleInput('description')"
        placeholder="Résumé ou description du livre..."
      ></textarea>
      <div class="char-count" :class="{ warning: (formData.description?.length || 0) > 900 }">
        {{ formData.description?.length || 0 }} / 1000
      </div>
      <span v-if="hasError('description')" class="error-message">
        {{ errors.description }}
      </span>
    </div>

    <!-- URL Couverture -->
    <div class="form-group" :class="{ error: hasError('coverUrl') }">
      <label for="coverUrl">URL de la couverture</label>
      <input
        id="coverUrl"
        v-model="formData.coverUrl"
        type="url"
        @blur="handleBlur('coverUrl')"
        @input="handleInput('coverUrl')"
        placeholder="https://example.com/cover.jpg"
      />
      <span v-if="hasError('coverUrl')" class="error-message">
        {{ errors.coverUrl }}
      </span>
    </div>

    <!-- Aperçu de la couverture -->
    <div v-if="formData.coverUrl" class="cover-preview">
      <label>Aperçu de la couverture</label>
      <img 
        :src="formData.coverUrl" 
        :alt="formData.title"
        @error="($event.target as HTMLImageElement).style.display = 'none'"
      />
    </div>

    <!-- Actions -->
    <div class="form-actions">
      <button type="button" class="btn btn-secondary" @click="handleCancel">
        Annuler
      </button>
      <button 
        type="submit" 
        class="btn btn-primary" 
        :disabled="loading"
      >
        <span v-if="loading">Enregistrement...</span>
        <span v-else>{{ props.isEdit ? 'Modifier' : 'Ajouter' }}</span>
      </button>
    </div>
  </form>
</template>

<style scoped>
.book-form {
  max-width: 600px;
  margin: 0 auto;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 480px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

.char-count {
  text-align: right;
  font-size: 0.75rem;
  color: var(--color-text-light);
  margin-top: 0.25rem;
}

.char-count.warning {
  color: var(--color-accent);
}

.cover-preview {
  margin-bottom: 1.5rem;
}

.cover-preview label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.cover-preview img {
  max-width: 150px;
  max-height: 200px;
  border-radius: var(--radius);
  box-shadow: var(--shadow-md);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
}
</style>
