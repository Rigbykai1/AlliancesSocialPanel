import { useCallback, useState } from 'react'

export const useApi = ({ onError } = {}) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = useCallback(
    async (asyncCallback) => {
      setLoading(true)
      setError(null)

      try {
        const result = await asyncCallback()
        return result
      } catch (err) {
        const message = err?.message || 'Error en la operación'
        setError(message)
        onError?.(message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [onError]
  )

  return {
    loading,
    error,
    setError,
    execute,
  }
}
