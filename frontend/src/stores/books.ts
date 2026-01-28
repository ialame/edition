import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import type { Book, BookCategory } from '@/types'

export const useBookStore = defineStore('books', () => {
  // ============ STATE ============
  const books = ref<Book[]>([])
  const currentBook = ref<Book | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Filtres
  const searchQuery = ref('')
  const selectedCategory = ref<BookCategory | null>(null)

  // ============ GETTERS ============
  
  /**
   * Livres filtrés par recherche et catégorie
   */
  const filteredBooks = computed(() => {
    let result = books.value
    
    // Filtre par recherche textuelle
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.isbn.includes(query)
      )
    }
    
    // Filtre par catégorie
    if (selectedCategory.value) {
      result = result.filter(book => book.category === selectedCategory.value)
    }
    
    return result
  })

  /**
   * Nombre total de livres
   */
  const bookCount = computed(() => books.value.length)
  
  /**
   * Nombre de livres filtrés
   */
  const filteredCount = computed(() => filteredBooks.value.length)

  /**
   * Livres groupés par catégorie
   */
  const booksByCategory = computed(() => {
    const grouped: Record<string, Book[]> = {}
    
    books.value.forEach(book => {
      const category = book.category
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(book)
    })
    
    return grouped
  })

  /**
   * Statistiques des catégories
   */
  const categoryStats = computed(() => {
    const stats: Record<string, number> = {}
    
    books.value.forEach(book => {
      stats[book.category] = (stats[book.category] || 0) + 1
    })
    
    return stats
  })

  // ============ ACTIONS ============

  /**
   * Récupérer tous les livres
   */
  async function fetchBooks() {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get<Book[]>('/books')
      books.value = response.data
    } catch (err: any) {
      error.value = 'Erreur lors du chargement des livres'
      console.error('Erreur fetchBooks:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Récupérer un livre par son ID
   */
  async function fetchBook(id: number): Promise<Book | null> {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get<Book>(`/books/${id}`)
      currentBook.value = response.data
      return response.data
    } catch (err: any) {
      error.value = 'Livre non trouvé'
      currentBook.value = null
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Créer un nouveau livre
   */
  async function createBook(book: Book): Promise<Book> {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post<Book>('/books', book)
      books.value.push(response.data)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de la création'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Mettre à jour un livre
   */
  async function updateBook(id: number, book: Book): Promise<Book> {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.put<Book>(`/books/${id}`, book)
      
      // Mettre à jour dans la liste locale
      const index = books.value.findIndex(b => b.id === id)
      if (index !== -1) {
        books.value[index] = response.data
      }
      
      // Mettre à jour le livre courant si c'est celui-là
      if (currentBook.value?.id === id) {
        currentBook.value = response.data
      }
      
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de la mise à jour'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Supprimer un livre
   */
  async function deleteBook(id: number): Promise<boolean> {
    loading.value = true
    error.value = null
    
    try {
      await api.delete(`/books/${id}`)
      
      // Retirer de la liste locale
      books.value = books.value.filter(b => b.id !== id)
      
      // Nettoyer le livre courant si c'est celui-là
      if (currentBook.value?.id === id) {
        currentBook.value = null
      }
      
      return true
    } catch (err: any) {
      error.value = 'Erreur lors de la suppression'
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Définir la recherche
   */
  function setSearchQuery(query: string) {
    searchQuery.value = query
  }

  /**
   * Définir la catégorie filtrée
   */
  function setCategory(category: BookCategory | null) {
    selectedCategory.value = category
  }

  /**
   * Réinitialiser les filtres
   */
  function clearFilters() {
    searchQuery.value = ''
    selectedCategory.value = null
  }

  /**
   * Réinitialiser l'erreur
   */
  function clearError() {
    error.value = null
  }

  return {
    // State
    books,
    currentBook,
    loading,
    error,
    searchQuery,
    selectedCategory,
    // Getters
    filteredBooks,
    bookCount,
    filteredCount,
    booksByCategory,
    categoryStats,
    // Actions
    fetchBooks,
    fetchBook,
    createBook,
    updateBook,
    deleteBook,
    setSearchQuery,
    setCategory,
    clearFilters,
    clearError
  }
})
