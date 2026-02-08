import {
    required, requiredIf, minLength, maxLength, email, url,
    alphaNum, numeric, sameAs, helpers, minValue
} from '@vuelidate/validators'

/**
 * agrupa reglas de validación envolviendo cada validador con helpers.withMessage 
 * para proporcionar mensajes de error en español. 
 * Esto centraliza las validaciones y sus textos, facilitando su reutilización en formularios.
 */
export const m = {
    required: (msg = 'Este campo es obligatorio') =>
        helpers.withMessage(msg, required),

    requiredIf: (condition, msg = 'Este campo es requerido') =>
        helpers.withMessage(msg, requiredIf(condition)),

    email: (msg = 'El formato de correo no es válido') =>
        helpers.withMessage(msg, email),

    numeric: (msg = 'Solo se permiten números') =>
        helpers.withMessage(msg, numeric),

    alphaNum: (msg = 'Solo se permiten letras y números') =>
        helpers.withMessage(msg, alphaNum),

    url: (msg = 'Debe ser una URL válida') =>
        helpers.withMessage(msg, url),

    // Con parámetros numéricos
    min: (n, msg = null) =>
        helpers.withMessage(msg || `Mínimo ${n} caracteres`, minLength(n)),

    max: (n, msg = null) =>
        helpers.withMessage(msg || `Máximo ${n} caracteres`, maxLength(n)),

    minVal: (n, msg = null) =>
        helpers.withMessage(msg || `El valor mínimo es ${n}`, minValue(n)),

    // Comparación
    sameAs: (fieldRef, label = 'el campo anterior', msg = null) =>
        helpers.withMessage(msg || `Debe coincidir con ${label}`, sameAs(fieldRef)),

    // Personalizados (Regex)
    slug: (msg = 'El slug solo permite minúsculas, números y guiones') =>
        helpers.withMessage(msg, helpers.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)),

    // Específicos para listas/permisos
    minEntity: (n, entity = null, msg = null) =>
        helpers.withMessage(msg || `Debe seleccionar al menos ${n} ${entity}`, minLength(n)),
}

/**
 * Función para extraer el primer mensaje de error de un campo
 * @param {Object} v$ - El objeto de validación de vuelidate
 * @param {string} field - El nombre del campo
 */
export const getError = (v$, field) => {
    if (!v$[field]?.$error) return ''
    return v$[field]?.$errors?.[0]?.$message ?? ''
}