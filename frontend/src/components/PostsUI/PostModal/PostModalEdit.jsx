import React, { useState, useRef, useEffect } from 'react'
import { PiNotePencil, PiImageSquare, PiCheckCircle } from "react-icons/pi"
import { tiposFormato } from '../../../utils/helpers'


const formatDateLabel = (fechaStr) => {
    if (!fechaStr) return ""
    return new Date(fechaStr + 'T00:00:00').toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    })
}

const PostModalEdit = ({ fields, onChange, postNombre }) => {
    const [previewUrl, setPreviewUrl] = useState(null)
    const fileInputRef = useRef(null)
    const changeInputRef = useRef(null)
    const { fecha, tipo, publicado, contenido, imagen } = fields

    const set = (key) => (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked
            : e.target.type === 'file' ? (e.target.files?.[0] || null)
                : e.target.value
        onChange(prev => ({ ...prev, [key]: value }))
    }

    const handleImageChange = (e) => {
        const file = e.target.files?.[0] ?? null
        if (previewUrl) URL.revokeObjectURL(previewUrl)
        if (file) {
            setPreviewUrl(URL.createObjectURL(file))
        } else {
            setPreviewUrl(null)
        }
        onChange(prev => ({ ...prev, imagen: file }))
    }

    const handleRemoveImage = () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
        onChange(prev => ({ ...prev, imagen: null }))
        if (fileInputRef.current) fileInputRef.current.value = ''
        if (changeInputRef.current) changeInputRef.current.value = ''
    }

    useEffect(() => {
        return () => { if (previewUrl) URL.revokeObjectURL(previewUrl) }
    }, [previewUrl])

    const handlePublicado = (e) => {
        onChange(prev => ({ ...prev, publicado: e.target.checked }))
    }

    const previewFileName = () => {
        if (!fecha || !imagen) return ""
        const ext = imagen.name.split('.').pop()
        return `Post ${formatDateLabel(fecha)}.${ext}`
    }

    const previewDisplayName = () => {
        if (!fecha) return postNombre || 'Sin nombre'
        return `Post ${formatDateLabel(fecha)}`
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-3 border-b border-base-300 pb-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold">Editar post</h1>
                    <p className="text-sm text-base-content/60">Modifica los datos del contenido seleccionado.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

                {/* Columna izquierda */}
                <div className="space-y-5">

                    {/* Datos básicos */}
                    <div className="card bg-base-200 border border-base-300 shadow-sm max-w-md">
                        <div className="card-body gap-4 p-5">
                            <h3 className="font-semibold text-base flex items-center gap-2">
                                <PiNotePencil className="size-5" />
                                Datos básicos
                            </h3>

                            <label className="form-control w-full">
                                <div className="label">
                                    <span className="label-text font-medium">Fecha de publicación</span>
                                </div>
                                <input
                                    type="date"
                                    className="input input-bordered w-full focus:outline-none"
                                    value={fecha}
                                    onChange={set('fecha')}
                                />
                            </label>

                            <label className="form-control w-full">
                                <div className="label">
                                    <span className="label-text font-medium">Tipo de formato</span>
                                </div>
                                <select
                                    className="select select-bordered w-full focus:outline-none"
                                    value={tipo}
                                    onChange={set('tipo')}
                                >
                                    <option value="">Selecciona un formato</option>
                                    {tiposFormato.map((f) => (
                                        <option key={f} value={f}>{f}</option>
                                    ))}
                                </select>
                            </label>

                            <label className="label cursor-pointer justify-start gap-3 rounded-xl border border-base-300 bg-base-100 px-4 py-3">
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-primary"
                                    checked={!!publicado}
                                    onChange={handlePublicado}
                                />
                                <span className="label-text font-medium">
                                    Publicado {publicado ? '✅' : '⬜'}
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Imagen */}
                    <div className="card bg-base-200 border border-base-300 shadow-sm max-w-md">
                        <div className="card-body gap-4 p-5">
                            <h3 className="font-semibold text-base flex items-center gap-2">
                                <PiImageSquare className="size-5" />
                                Imagen
                            </h3>

                            {/* Área de preview clickeable */}
                            <div
                                className={`relative rounded-xl bg-base-100 overflow-hidden transition-all
                                    ${previewUrl
                                        ? 'border border-base-300'
                                        : 'border-2 border-dashed border-base-300 hover:border-primary/40 cursor-pointer'
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

                            {/* Input oculto (para el placeholder clickeable) */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />

                            {/* Botones cuando hay imagen */}
                            {imagen && (
                                <div className="flex gap-2">
                                    <label className="btn btn-outline btn-sm flex-1 cursor-pointer">
                                        Cambiar imagen
                                        <input
                                            ref={changeInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
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

                            {/* Nombre generado */}
                            {imagen && previewFileName() && (
                                <div>
                                    <p className="label-text font-medium mb-1">Nombre generado</p>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full bg-base-100 focus:outline-none"
                                        value={previewFileName()}
                                        readOnly
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Columna derecha */}
                <div className="space-y-5">

                    {/* Contenido */}
                    <div className="card bg-base-200 border border-base-300 shadow-sm">
                        <div className="card-body gap-4 p-5">
                            <h3 className="font-semibold text-base">Contenido</h3>
                            <label className="form-control">
                                <div className="label">
                                    <span className="label-text font-medium">Texto del post</span>
                                </div>
                                <textarea
                                    className="textarea textarea-bordered min-h-52 w-full resize-y focus:outline-none"
                                    value={contenido}
                                    onChange={set('contenido')}
                                    placeholder="Escribe o pega el contenido del post..."
                                />
                            </label>
                        </div>
                    </div>

                    {/* Vista rápida */}
                    <div className="card bg-base-200 border border-base-300 shadow-sm">
                        <div className="card-body gap-3 p-5">
                            <h3 className="font-semibold text-base">Vista rápida</h3>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="rounded-xl bg-base-100 p-3 border border-base-300">
                                    <p className="text-base-content/60">Nombre</p>
                                    <p className="font-medium wrap-break-word">{previewDisplayName()}</p>
                                </div>
                                <div className="rounded-xl bg-base-100 p-3 border border-base-300">
                                    <p className="text-base-content/60">Estado</p>
                                    <p className="font-medium flex items-center gap-1">
                                        <PiCheckCircle className={`size-4 ${publicado ? 'text-success' : 'text-warning'}`} />
                                        {publicado ? 'Publicado' : 'Pendiente'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default PostModalEdit
