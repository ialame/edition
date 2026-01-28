export interface Book {
  id?: number
  title: string
  author: string
  isbn: string
  price: number
  description?: string
  coverUrl?: string
  publicationYear?: number
  category: BookCategory
}

export enum BookCategory {
  ROMAN = 'ROMAN',
  POESIE = 'POESIE',
  THEATRE = 'THEATRE',
  ESSAI = 'ESSAI',
  BIOGRAPHIE = 'BIOGRAPHIE',
  JEUNESSE = 'JEUNESSE'
}

export const BookCategoryLabels: Record<BookCategory, string> = {
  [BookCategory.ROMAN]: 'Roman',
  [BookCategory.POESIE]: 'Poésie',
  [BookCategory.THEATRE]: 'Théâtre',
  [BookCategory.ESSAI]: 'Essai',
  [BookCategory.BIOGRAPHIE]: 'Biographie',
  [BookCategory.JEUNESSE]: 'Jeunesse'
}

export interface User {
  username: string
  role: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterCredentials {
  username: string
  password: string
}

export interface AuthResponse {
  token: string
  username: string
  role: string
}

export interface ApiError {
  message: string
  field?: string
}
