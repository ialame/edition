import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { title: 'Accueil' }
    },
    {
      path: '/books',
      name: 'books',
      component: () => import('@/views/BooksView.vue'),
      meta: { title: 'Catalogue' }
    },
    {
      path: '/books/:id',
      name: 'book-detail',
      component: () => import('@/views/BookDetailView.vue'),
      props: true,
      meta: { title: 'Détail du livre' }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { 
        title: 'Connexion',
        guest: true  // Accessible uniquement aux non-connectés
      }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { 
        title: 'Inscription',
        guest: true
      }
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/AdminView.vue'),
      meta: { 
        title: 'Administration',
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    {
      path: '/admin/books/new',
      name: 'book-create',
      component: () => import('@/views/BookFormView.vue'),
      meta: { 
        title: 'Ajouter un livre',
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    {
      path: '/admin/books/:id/edit',
      name: 'book-edit',
      component: () => import('@/views/BookFormView.vue'),
      props: true,
      meta: { 
        title: 'Modifier le livre',
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { title: 'Page non trouvée' }
    }
  ]
})

// Navigation Guards
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()
  
  // Mettre à jour le titre de la page
  document.title = `${to.meta.title || 'Page'} | Les Belles Lettres`
  
  // Vérifier l'authentification au premier chargement
  if (authStore.token && !authStore.user) {
    await authStore.checkAuth()
  }
  
  // Route protégée - nécessite authentification
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ 
      name: 'login', 
      query: { redirect: to.fullPath } 
    })
  }
  
  // Route admin - nécessite le rôle admin
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    // Rediriger vers l'accueil si connecté mais pas admin
    return next({ name: 'home' })
  }
  
  // Route guest (login/register) - rediriger si déjà connecté
  if (to.meta.guest && authStore.isAuthenticated) {
    return next({ name: 'home' })
  }
  
  next()
})

export default router
