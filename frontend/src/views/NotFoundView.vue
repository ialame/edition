<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="not-found-page">
    <div class="not-found-content">
      <div class="error-code">404</div>
      <h1>Page non trouvée</h1>
      <p>
        Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <div class="actions">
        <RouterLink to="/" class="btn btn-primary">
          Retour à l'accueil
        </RouterLink>
        <RouterLink to="/books" class="btn btn-outline">
          Voir le catalogue
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found-page {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.not-found-content {
  max-width: 500px;
}

.error-code {
  font-size: 8rem;
  font-weight: 700;
  color: var(--color-primary);
  font-family: var(--font-heading);
  line-height: 1;
  margin-bottom: 1rem;
  opacity: 0.5;
}

h1 {
  font-size: 2rem;
  color: var(--color-text);
  margin-bottom: 1rem;
}

p {
  color: var(--color-text-light);
  font-size: 1.125rem;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 480px) {
  .error-code {
    font-size: 5rem;
  }

  h1 {
    font-size: 1.5rem;
  }

  p {
    font-size: 1rem;
  }

  .actions {
    flex-direction: column;
  }

  .actions .btn {
    width: 100%;
  }
}
</style>
