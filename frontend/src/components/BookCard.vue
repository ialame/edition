<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Book } from '@/types'
import { BookCategoryLabels } from '@/types'

const props = defineProps<{
  book: Book
}>()

const categoryLabel = computed(() => {
  return BookCategoryLabels[props.book.category] || props.book.category
})

const formattedPrice = computed(() => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(props.book.price)
})

const defaultCover = 'https://via.placeholder.com/200x300/e2e8f0/64748b?text=Pas+de+couverture'
</script>

<template>
  <RouterLink :to="`/books/${book.id}`" class="book-card">
    <div class="book-cover">
      <img 
        :src="book.coverUrl || defaultCover" 
        :alt="book.title"
        @error="($event.target as HTMLImageElement).src = defaultCover"
      />
      <span class="book-category">{{ categoryLabel }}</span>
    </div>
    <div class="book-info">
      <h3 class="book-title">{{ book.title }}</h3>
      <p class="book-author">{{ book.author }}</p>
      <p class="book-price">{{ formattedPrice }}</p>
    </div>
  </RouterLink>
</template>

<style scoped>
.book-card {
  display: block;
  background: white;
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: transform 0.2s, box-shadow 0.2s;
  text-decoration: none;
  color: inherit;
}

.book-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.book-cover {
  position: relative;
  aspect-ratio: 2/3;
  overflow: hidden;
  background-color: var(--color-bg-alt);
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-category {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: var(--color-primary);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.book-info {
  padding: 1rem;
}

.book-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--color-text);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.book-author {
  font-size: 0.875rem;
  color: var(--color-text-light);
  margin-bottom: 0.5rem;
}

.book-price {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-secondary);
}
</style>
