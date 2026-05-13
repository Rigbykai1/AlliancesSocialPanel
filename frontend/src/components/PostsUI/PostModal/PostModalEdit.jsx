import React from 'react'
import { PiNotePencil, PiCheckCircle } from 'react-icons/pi'
import { tiposFormato } from '../../../utils/helpers'
import { formatDateLabel } from '../../../utils/date'
import ImageUploadPreview from '../../UI/ImageUploadPreview'

const PostModalEdit = ({ fields, onChange, postNombre }) => {
    const { fecha, tipo, publicado, contenido, imagen } = fields

    const set = (key) => (e) => {
        const value = e.target.type === 'checkbox'
            ? e.target.checked
            : e.target.value
        onChange(prev => ({ ...prev, [key]: value }))
    }

    const handleImageChange = (file) => {
        onChange(prev => ({ ...prev, imagen: file }))
    }

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Columna izquierda */}
                <div className="flex flex-col space-y-5 items-center">

                    {/* Datos básicos */}
                    <div className="card bg-base-200 border border-base-300 shadow-sm w-full md:max-w-md">
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

                            <label className="label cursor-pointer justify-start gap-3 rounded-xl border border-base-300 bg-base-100 px-4 py-3 w-full">
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
                    <div className="card bg-base-200 border border-base-300 shadow-sm w-full md:max-w-md">
                        <div className="card-body gap-4 p-5">
                            <h3 className="font-semibold text-base flex items-center gap-2">
                                Imagen
                            </h3>
                            <ImageUploadPreview
                                image={imagen}
                                onChange={handleImageChange}
                                label="Imagen"
                            />

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
