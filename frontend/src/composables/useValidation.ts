import { reactive, computed, toRefs } from 'vue'

// Type pour une règle de validation
type ValidationRule = (value: any) => string | true

// Interface pour les règles par champ
interface FieldRules {
  [field: string]: ValidationRule[]
}

// Interface pour l'état du formulaire
interface FormState {
  formData: Record<string, any>
  errors: Record<string, string>
  touched: Record<string, boolean>
}

/**
 * Composable pour la gestion de la validation des formulaires
 */
export function useValidation<T extends Record<string, any>>(
  initialData: T,
  rules: FieldRules
) {
  // État réactif du formulaire
  const state: FormState = reactive({
    formData: { ...initialData },
    errors: {},
    touched: {}
  })

  // Le formulaire est valide si pas d'erreurs et au moins un champ touché
  const isValid = computed(() => {
    return Object.keys(state.errors).length === 0 &&
           Object.keys(state.touched).length > 0
  })

  // Vérifier si le formulaire a été modifié
  const isDirty = computed(() => {
    return Object.keys(state.touched).length > 0
  })

  /**
   * Valider un champ spécifique
   */
  function validateField(field: string): boolean {
    const fieldRules = rules[field]
    if (!fieldRules) return true

    const value = state.formData[field]
    
    for (const rule of fieldRules) {
      const result = rule(value)
      if (result !== true) {
        state.errors[field] = result
        return false
      }
    }
    
    // Pas d'erreur, supprimer l'erreur existante
    delete state.errors[field]
    return true
  }

  /**
   * Valider tous les champs
   */
  function validateAll(): boolean {
    let valid = true
    
    for (const field of Object.keys(rules)) {
      state.touched[field] = true
      if (!validateField(field)) {
        valid = false
      }
    }
    
    return valid
  }

  /**
   * Gestionnaire d'événement blur
   */
  function handleBlur(field: string): void {
    state.touched[field] = true
    validateField(field)
  }

  /**
   * Gestionnaire d'événement input (validation en temps réel)
   */
  function handleInput(field: string): void {
    if (state.touched[field]) {
      validateField(field)
    }
  }

  /**
   * Réinitialiser le formulaire
   */
  function resetForm(): void {
    Object.keys(state.formData).forEach(key => {
      state.formData[key] = initialData[key]
    })
    Object.keys(state.errors).forEach(key => delete state.errors[key])
    Object.keys(state.touched).forEach(key => delete state.touched[key])
  }

  /**
   * Définir les données du formulaire
   */
  function setFormData(data: Partial<T>): void {
    Object.keys(data).forEach(key => {
      state.formData[key] = data[key]
    })
  }

  /**
   * Obtenir l'erreur d'un champ
   */
  function getError(field: string): string | undefined {
    return state.touched[field] ? state.errors[field] : undefined
  }

  /**
   * Vérifier si un champ a une erreur
   */
  function hasError(field: string): boolean {
    return state.touched[field] && !!state.errors[field]
  }

  /**
   * Obtenir les données du formulaire (copie)
   */
  function getFormData(): T {
    return { ...state.formData } as T
  }

  return {
    // État réactif (toRefs pour pouvoir déstructurer)
    ...toRefs(state),
    // Computed
    isValid,
    isDirty,
    // Méthodes
    validateField,
    validateAll,
    handleBlur,
    handleInput,
    resetForm,
    setFormData,
    getError,
    hasError,
    getFormData
  }
}

// ============ RÈGLES DE VALIDATION PRÉDÉFINIES ============

export const validationRules = {
  /**
   * Champ obligatoire
   */
  required: (message = 'Ce champ est obligatoire'): ValidationRule => 
    (value) => {
      if (value === null || value === undefined || value === '') {
        return message
      }
      if (Array.isArray(value) && value.length === 0) {
        return message
      }
      return true
    },

  /**
   * Longueur minimale
   */
  minLength: (min: number, message?: string): ValidationRule =>
    (value) => {
      if (value && value.length < min) {
        return message || `Minimum ${min} caractères requis`
      }
      return true
    },

  /**
   * Longueur maximale
   */
  maxLength: (max: number, message?: string): ValidationRule =>
    (value) => {
      if (value && value.length > max) {
        return message || `Maximum ${max} caractères autorisés`
      }
      return true
    },

  /**
   * Validation email
   */
  email: (message = 'Adresse email invalide'): ValidationRule =>
    (value) => {
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return message
      }
      return true
    },

  /**
   * Validation ISBN (format: 978-XXXXXXXXXX)
   */
  isbn: (message = 'Format ISBN invalide (ex: 978-2070360024)'): ValidationRule =>
    (value) => {
      if (value && !/^978-\d{10}$/.test(value)) {
        return message
      }
      return true
    },

  /**
   * Nombre positif
   */
  positiveNumber: (message = 'Doit être un nombre positif'): ValidationRule =>
    (value) => {
      if (value !== null && value !== undefined && value !== '') {
        const num = Number(value)
        if (isNaN(num) || num < 0) {
          return message
        }
      }
      return true
    },

  /**
   * Nombre minimum
   */
  min: (minValue: number, message?: string): ValidationRule =>
    (value) => {
      if (value !== null && value !== undefined && value !== '') {
        const num = Number(value)
        if (!isNaN(num) && num < minValue) {
          return message || `La valeur minimale est ${minValue}`
        }
      }
      return true
    },

  /**
   * Nombre maximum
   */
  max: (maxValue: number, message?: string): ValidationRule =>
    (value) => {
      if (value !== null && value !== undefined && value !== '') {
        const num = Number(value)
        if (!isNaN(num) && num > maxValue) {
          return message || `La valeur maximale est ${maxValue}`
        }
      }
      return true
    },

  /**
   * Validation d'année
   */
  year: (message = 'Année invalide'): ValidationRule =>
    (value) => {
      if (value !== null && value !== undefined && value !== '') {
        const currentYear = new Date().getFullYear()
        const year = Number(value)
        if (isNaN(year) || year < 1450 || year > currentYear + 1) {
          return message
        }
      }
      return true
    },

  /**
   * Pattern personnalisé
   */
  pattern: (regex: RegExp, message: string): ValidationRule =>
    (value) => {
      if (value && !regex.test(value)) {
        return message
      }
      return true
    },

  /**
   * URL valide
   */
  url: (message = 'URL invalide'): ValidationRule =>
    (value) => {
      if (value) {
        try {
          new URL(value)
        } catch {
          return message
        }
      }
      return true
    }
}
