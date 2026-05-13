export const ES_LOCALE = 'es-ES'

export const getTodayInputValue = () => new Date().toISOString().slice(0, 10)

export const formatDateLabel = (fechaStr) => {
  if (!fechaStr) return ''
  return new Date(`${fechaStr}T00:00:00`).toLocaleDateString(ES_LOCALE, {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

export const formatDateLong = (fechaStr) => {
  if (!fechaStr) return 'Sin fecha'
  return new Date(`${fechaStr}T00:00:00`).toLocaleDateString(ES_LOCALE, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
