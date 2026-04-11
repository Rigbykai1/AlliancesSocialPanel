export const formatFecha = (fecha) => {
  if (!fecha) return 'Sin fecha'

  const date = new Date(fecha)

  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const year = date.getFullYear()

  return `${month}-${day}-${year}`
}

export const tiposFormato = [
  'Descubre el error 🔎',
  'Dato sorprendente 🤯',
  'Comparación ⚖️',
  'Situación relatable 😅',
  'Mini guía 📚',
]