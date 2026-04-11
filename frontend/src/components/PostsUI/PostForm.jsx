import React, { useState, useEffect, useRef } from 'react'
import { PiImageSquare } from 'react-icons/pi'
import { tiposFormato } from '../../utils/helpers'
import { useNotifications } from '../../hooks/useNotifications'

export default function PostForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    titulo: '',
    fecha: new Date().toISOString().split('T')[0],
    tipo: 'Comparación visual ⚖️',
    contenido: '',
    imagen: null
  })
  const [previewUrl, setPreviewUrl] = useState(null)
  const fileInputRef = useRef(null)
  const changeInputRef = useRef(null)
  const { notifySuccess, notifyError } = useNotifications()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] ?? null
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    if (file) {
      setPreviewUrl(URL.createObjectURL(file))
      setFormData(prev => ({ ...prev, imagen: file }))
    } else {
      setFormData(prev => ({ ...prev, imagen: null }))
    }
  }

  const handleRemoveImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    setFormData(prev => ({ ...prev, imagen: null }))
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (changeInputRef.current) changeInputRef.current.value = ''
  }

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.fecha || !formData.contenido) {
      notifyError('Por favor completa los campos requeridos')
      return
    }

    const form = new FormData()
    form.append('titulo', formData.titulo)
    form.append('fecha', formData.fecha)
    form.append('tipo', formData.tipo)
    form.append('contenido', formData.contenido)
    if (formData.imagen) form.append('imagen', formData.imagen)

    try {
      const result = await onSubmit(form)
      const label = result?.id || formData.fecha
      notifySuccess(`Post ${label} creado correctamente`)
      setFormData({
        titulo: '',
        fecha: new Date().toISOString().split('T')[0],
        tipo: 'Comparación visual ⚖️',
        contenido: '',
        imagen: null
      })
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
      }
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err) {
      notifyError('Error al crear el post: ' + (err?.message || 'Error desconocido'))
    }
  }

  const handleReset = () => {
    setFormData({
      titulo: '',
      fecha: new Date().toISOString().split('T')[0],
      tipo: 'Comparación visual ⚖️',
      contenido: '',
      imagen: null
    })
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="card bg-base-200 shadow-lg border border-base-300 overflow-hidden">
        <div className="card-body p-6 md:p-8">
          <header className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-2xl font-bold">Crear Nuevo Post</h2>
            <p className="text-sm text-base-content/60">Publica contenido atractivo y visual</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Columna izquierda: metadatos */}
            <div className="space-y-4">
              <div className="flex gap-3">
                <label className="w-1/2">
                  <span className="label-text font-semibold">📅 Fecha</span>
                  <input
                    type="date"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleChange}
                    required
                    className="input input-bordered w-full mt-2 focus:outline-none"
                    aria-label="Fecha de publicación"
                  />
                </label>

                <label className="w-1/2">
                  <span className="label-text font-semibold">🎨 Formato</span>
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                    className="select select-bordered w-full mt-2 focus:outline-none"
                    aria-label="Tipo de formato"
                  >
                    {tiposFormato.map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </label>
              </div>

              {/* Sección imagen rediseñada */}
              <div className="space-y-3">
                <span className="label-text font-semibold">🖼 Imagen</span>

                {/* Área de preview */}
                <div
                  className={`relative rounded-xl bg-base-100 overflow-hidden transition-all cursor-pointer
                    ${previewUrl
                      ? 'border border-base-300'
                      : 'border-2 border-dashed border-base-300 hover:border-primary/40'
                    }`}
                  onClick={() => !previewUrl && fileInputRef.current?.click()}
                >
                  {previewUrl ? (
                    <>
                      <img
                        src={previewUrl}
                        alt="Vista previa"
                        className="w-full max-h-48 object-contain p-2"
                      />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleRemoveImage() }}
                        className="btn btn-xs btn-circle btn-ghost absolute top-2 right-2 bg-base-100 border border-base-300"
                        aria-label="Quitar imagen"
                      >
                        ✕
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 py-8 text-base-content/40">
                      <PiImageSquare className="size-8" />
                      <p className="text-sm">Haz clic para subir una imagen</p>
                      <p className="text-xs">JPG, PNG · máx. 5 MB</p>
                    </div>
                  )}
                </div>

                {/* Input file oculto (para el placeholder clickeable) */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  aria-label="Subir imagen"
                />

                {/* Botones de acción cuando hay imagen */}
                {formData.imagen && (
                  <div className="flex gap-2">
                    <label className="btn btn-outline btn-sm flex-1 cursor-pointer">
                      Cambiar imagen
                      <input
                        ref={changeInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="btn btn-ghost btn-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                )}

                {/* Nombre del archivo seleccionado */}
                {formData.imagen && (
                  <p className="text-xs text-base-content/50 truncate">
                    {formData.imagen.name}
                  </p>
                )}
              </div>
            </div>

            {/* Columna derecha: contenido */}
            <div className="md:col-span-2 flex flex-col gap-4">
              <label className="block w-full">
                <span className="label-text font-semibold">📝 Contenido</span>
                <textarea
                  name="contenido"
                  value={formData.contenido}
                  onChange={handleChange}
                  placeholder="Escribe el contenido de tu post aquí..."
                  rows="10"
                  required
                  className="textarea textarea-bordered w-full mt-2 min-h-55 resize-vertical focus:outline-none"
                />
                <span className="text-xs text-base-content/50 mt-2 block">
                  Puedes usar **markdown** para dar formato
                </span>
              </label>
            </div>
          </div>

          {/* Acciones */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-base-content/50">
              <strong>Consejo</strong>: usa imágenes en formato JPG o PNG y mantén el tamaño por debajo de 5 MB.
            </div>
            <div className="flex items-center gap-3">
              <button type="submit" className="btn btn-primary">
                Crear Post
              </button>
              <button type="button" className="btn btn-ghost" onClick={handleReset}>
                Limpiar
              </button>
            </div>
          </div>

        </div>
      </div>
    </form>
  )
}
