# TP3 - Maison d'Édition "Les Belles Lettres"

## Solution Complète - Full Stack Vue.js 3 + Spring Boot

Cette archive contient la solution complète du TP3 sur Pinia, la validation de formulaires et l'authentification JWT.

---

## 📋 Table des Matières

1. [Prérequis](#prérequis)
2. [Installation](#installation)
3. [Lancement](#lancement)
4. [Comptes de Test](#comptes-de-test)
5. [Structure du Projet](#structure-du-projet)
6. [Endpoints API](#endpoints-api)
7. [Fonctionnalités Implémentées](#fonctionnalités-implémentées)

---

## 🔧 Prérequis

### Backend
- **Java 17** ou supérieur
- **Maven 3.8+**

### Frontend
- **Node.js 18+**
- **npm 9+**

---

## 📦 Installation

### Backend (Spring Boot)

```bash
cd backend
mvn clean install
```

### Frontend (Vue.js 3)

```bash
cd frontend
npm install
```

---

## 🚀 Lancement

### 1. Démarrer le Backend (port 8080)

```bash
cd backend
mvn spring-boot:run
```

Le serveur démarre sur `http://localhost:8080`

Console H2 disponible sur : `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:editiondb`
- Username: `sa`
- Password: (vide)

### 2. Démarrer le Frontend (port 5173)

```bash
cd frontend
npm run dev
```

L'application est accessible sur `http://localhost:5173`

---

## 👤 Comptes de Test

| Username | Password | Rôle | Permissions |
|----------|----------|------|-------------|
| `admin` | `admin123` | ROLE_ADMIN | Lecture + Écriture (CRUD complet) |
| `user` | `user123` | ROLE_USER | Lecture seule |

---

## 📁 Structure du Projet

```
tp-edition/
├── README.md                 # Ce fichier
├── TP3_Pinia_Validation_Auth.tex   # Énoncé LaTeX
├── TP3_Pinia_Validation_Auth.pdf   # Énoncé PDF
│
├── backend/                  # API Spring Boot
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/edition/
│       │   ├── EditionApplication.java
│       │   ├── config/
│       │   │   ├── SecurityConfig.java      # Config Spring Security + JWT
│       │   │   └── DataInitializer.java     # Données initiales
│       │   ├── controller/
│       │   │   ├── AuthController.java      # Login, Register, Me
│       │   │   └── BookController.java      # CRUD Livres
│       │   ├── dto/
│       │   │   ├── LoginRequest.java
│       │   │   ├── RegisterRequest.java
│       │   │   ├── AuthResponse.java
│       │   │   └── UserResponse.java
│       │   ├── model/
│       │   │   ├── User.java
│       │   │   ├── Book.java
│       │   │   ├── Role.java
│       │   │   └── BookCategory.java
│       │   ├── repository/
│       │   │   ├── UserRepository.java
│       │   │   └── BookRepository.java
│       │   ├── security/
│       │   │   ├── JwtUtils.java            # Génération/Validation JWT
│       │   │   └── JwtAuthenticationFilter.java
│       │   └── service/
│       │       ├── UserService.java
│       │       └── BookService.java
│       └── resources/
│           └── application.properties
│
└── frontend/                 # Application Vue.js 3
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json
    ├── index.html
    └── src/
        ├── main.ts
        ├── App.vue
        ├── style.css
        ├── types/
        │   └── index.ts              # Interfaces TypeScript
        ├── services/
        │   └── api.ts                # Axios + Intercepteurs
        ├── stores/
        │   ├── auth.ts               # Store Pinia Authentification
        │   └── books.ts              # Store Pinia Livres
        ├── composables/
        │   └── useValidation.ts      # Composable de validation
        ├── router/
        │   └── index.ts              # Routes + Guards
        ├── components/
        │   ├── NavBar.vue
        │   ├── BookCard.vue
        │   └── BookForm.vue
        └── views/
            ├── HomeView.vue
            ├── BooksView.vue
            ├── BookDetailView.vue
            ├── LoginView.vue
            ├── RegisterView.vue
            ├── AdminView.vue
            ├── BookFormView.vue
            └── NotFoundView.vue
```

---

## 🌐 Endpoints API

### Authentification

| Méthode | URL | Description | Accès |
|---------|-----|-------------|-------|
| POST | `/api/auth/login` | Connexion | Public |
| POST | `/api/auth/register` | Inscription | Public |
| GET | `/api/auth/me` | Utilisateur courant | Authentifié |

### Livres

| Méthode | URL | Description | Accès |
|---------|-----|-------------|-------|
| GET | `/api/books` | Liste des livres | Public |
| GET | `/api/books/{id}` | Détail d'un livre | Public |
| GET | `/api/books/category/{cat}` | Livres par catégorie | Public |
| POST | `/api/books` | Créer un livre | Admin |
| PUT | `/api/books/{id}` | Modifier un livre | Admin |
| DELETE | `/api/books/{id}` | Supprimer un livre | Admin |

### Exemple de Requête avec JWT

```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Réponse
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "admin",
  "role": "ROLE_ADMIN"
}

# Créer un livre (avec token)
curl -X POST http://localhost:8080/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..." \
  -d '{
    "title": "Nouveau Livre",
    "author": "Auteur Test",
    "isbn": "978-1234567890",
    "price": 19.99,
    "category": "ROMAN",
    "publicationYear": 2024
  }'
```

---

## ✅ Fonctionnalités Implémentées

### Backend (Spring Boot)

- [x] Entités JPA : `User`, `Book` avec relations
- [x] Enum `Role` (ROLE_USER, ROLE_ADMIN) et `BookCategory`
- [x] Configuration Spring Security stateless
- [x] Génération et validation de tokens JWT
- [x] Filtre d'authentification JWT
- [x] CORS configuré pour le frontend
- [x] Endpoints REST sécurisés par rôle
- [x] Hachage BCrypt des mots de passe
- [x] Données initiales (2 utilisateurs + 8 livres)

### Frontend (Vue.js 3)

- [x] **Store Auth (Pinia)**
  - Login/Logout
  - Persistance localStorage
  - Getters: isAuthenticated, isAdmin
  - Action checkAuth pour vérifier le token

- [x] **Store Books (Pinia)**
  - CRUD complet
  - Filtrage par recherche et catégorie
  - Gestion loading/error
  - Statistiques par catégorie

- [x] **Validation (Composable)**
  - Règles réutilisables
  - Validation au blur et en temps réel
  - Gestion des champs touchés
  - Messages d'erreur personnalisés

- [x] **Router**
  - Routes publiques et protégées
  - Guard d'authentification
  - Guard de rôle admin
  - Redirection post-login

- [x] **Composants**
  - NavBar avec état de connexion
  - BookCard responsive
  - BookForm avec validation complète

- [x] **Views**
  - Home : Présentation + livres récents
  - Books : Catalogue avec filtres
  - BookDetail : Fiche détaillée
  - Login/Register : Formulaires authentification
  - Admin : Dashboard administrateur
  - BookForm : Création/Édition

---

## 📚 Livres de Test

L'application est pré-chargée avec 8 livres de la littérature française :

1. Les Fleurs du Mal - Charles Baudelaire (Poésie)
2. Le Petit Prince - Antoine de Saint-Exupéry (Roman)
3. Germinal - Émile Zola (Roman)
4. Cyrano de Bergerac - Edmond Rostand (Théâtre)
5. Les Misérables - Victor Hugo (Roman)
6. L'Étranger - Albert Camus (Roman)
7. Les Essais - Michel de Montaigne (Essai)
8. Mémoires d'Hadrien - Marguerite Yourcenar (Biographie)

---

## 🔐 Sécurité

### JWT Configuration

- Algorithme : HS256
- Expiration : 24 heures (86400000 ms)
- Secret : Configuré dans `application.properties`

### Points de Sécurité Implémentés

1. Mots de passe hashés avec BCrypt
2. Tokens JWT signés et vérifiés
3. Sessions stateless (pas de cookies de session)
4. CORS restreint aux origines autorisées
5. Protection CSRF désactivée (non nécessaire avec JWT)
6. Endpoints sensibles protégés par rôle

---

## 🧪 Tests Manuels

### Scénario 1 : Consultation publique
1. Accéder à `http://localhost:5173`
2. Naviguer vers "Catalogue"
3. Filtrer par catégorie "Roman"
4. Cliquer sur un livre pour voir les détails

### Scénario 2 : Connexion Admin
1. Cliquer sur "Connexion"
2. Entrer `admin` / `admin123`
3. Vérifier l'apparition du lien "Administration"
4. Accéder au dashboard admin

### Scénario 3 : CRUD Livre (Admin)
1. Se connecter en admin
2. Aller dans Administration > Ajouter un livre
3. Remplir le formulaire (tester la validation)
4. Sauvegarder et vérifier dans le catalogue
5. Modifier le livre
6. Supprimer le livre

### Scénario 4 : Protection des routes
1. Se déconnecter
2. Essayer d'accéder à `/admin` directement
3. Vérifier la redirection vers `/login`
4. Se connecter avec `user` / `user123`
5. Vérifier que l'accès admin est refusé

---

## 📝 Notes pour les Étudiants

### Réponses aux Questions du TP

Les réponses aux 25 questions du TP doivent être rédigées dans votre rapport. Voici quelques pistes :

**Q1 (Sessions vs JWT)** : Les sessions sont préférables quand on a besoin de révocation immédiate (ex: application bancaire).

**Q9 (CSRF + JWT)** : CSRF exploite les cookies automatiques. JWT dans localStorage n'est pas envoyé automatiquement.

**Q17 (Risques localStorage)** : Vulnérable aux attaques XSS. Alternative : cookies HttpOnly.

**Q21 (touched)** : Évite d'afficher des erreurs sur un formulaire vierge, meilleure UX.

---

## 📄 Licence

Ce projet est fourni à des fins éducatives dans le cadre du cours de développement Full Stack.
