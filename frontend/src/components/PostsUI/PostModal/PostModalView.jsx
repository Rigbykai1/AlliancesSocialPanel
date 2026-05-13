import { useState } from 'react'
import { formatDateLong } from '../../../utils/date'

const PostModalView = ({ post }) => {
    const [imageError, setImageError] = useState(false)
    const imageSrc = post.imageUrl || null

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-3 border-b border-base-300 pb-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold">Vista del post</h1>
                    <p className="text-sm text-base-content/60">Revisa el contenido antes de editar o eliminar.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Imagen + metadata */}
                <div className="card bg-base-200 border border-base-300 shadow-sm overflow-hidden">
                    <div className="card-body p-0">
                        <div className="px-5 pt-5 pb-3">
                            <h2 className="text-sm uppercase tracking-widest text-base-content/50 font-bold">
                                Vista previa del post
                            </h2>
                        </div>

                        <div
                            className="relative min-h-80 cursor-pointer overflow-hidden lg:rounded-b-box m-3 group transition-all duration-300"
                            onClick={() =>
                                imageSrc && !imageError &&
                                window.open(imageSrc, '_blank', `width=${screen.width},height=${screen.height},top=0,left=0`)
                            }
                        >
                            {/* Fondo imagen */}
                            <div
                                className="absolute inset-0 opacity-30 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
                                style={
                                    imageSrc && !imageError
                                        ? {
                                            backgroundImage: `url(${imageSrc})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            backgroundRepeat: 'no-repeat'
                                        }
                                        : { backgroundColor: 'var(--b2)' }
                                }
                            >
                                {/* Imagen oculta para detectar error de carga */}
                                {imageSrc && (
                                    <img
                                        src={imageSrc}
                                        alt=""
                                        className="hidden"
                                        onError={() => setImageError(true)}
                                    />
                                )}
                            </div>

                            {/* Gradiente */}
                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

                            {/* Contenido superpuesto */}
                            <div className="relative z-10 flex h-full flex-col justify-end p-5 sm:p-6 text-white">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs uppercase tracking-widest text-white/70">Nombre</p>
                                        <p className="text-lg font-semibold wrap-break-word">{post.nombre}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="rounded-xl bg-white/10 backdrop-blur px-3 py-2 border border-white/10">
                                            <p className="text-[11px] uppercase tracking-widest text-white/60">Publicado</p>
                                            <p className="text-sm font-medium">{post['Publicado'] ? 'Sí' : 'No'}</p>
                                        </div>

                                        <div className="rounded-xl bg-white/10 backdrop-blur px-3 py-2 border border-white/10">
                                            <p className="text-[11px] uppercase tracking-widest text-white/60">Tipo</p>
                                            <p className="text-sm font-medium wrap-break-word">
                                                {post['Tipo de formato'] || 'Sin tipo'}
                                            </p>
                                        </div>
                                    </div>

                                    {post['Fecha de publicación'] && (
                                        <div className="rounded-xl bg-white/10 backdrop-blur px-3 py-2 border border-white/10">
                                            <p className="text-[11px] uppercase tracking-widest text-white/60">Fecha</p>
                                            <p className="text-sm font-medium">
                                                {formatDateLong(post['Fecha de publicación'])}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contenido */}
                <div className="card bg-base-200 border border-base-300 shadow-sm">
                    <div className="card-body p-0">
                        <div className="px-5 pt-5 pb-3">
                            <h2 className="text-sm uppercase tracking-widest text-base-content/50 font-bold">
                                Contenido
                            </h2>
                        </div>

                        <div className="px-5 pb-5">
                            <div className="max-h-80 overflow-y-auto rounded-box bg-base-100 border border-base-300 p-4 sm:p-5">
                                <pre className="whitespace-pre-wrap text-sm leading-relaxed text-base-content/90 font-sans">
                                    {post.contenido || post.preview || 'No hay contenido disponible'}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostModalView