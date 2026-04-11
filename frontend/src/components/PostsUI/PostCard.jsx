import { PiMetaLogo } from "react-icons/pi"

const PostCard = ({ post, onClick }) => {
    const imageSrc = post.imageUrl || null

    return (
        <div
            className="hover-3d my-6 mx-2 cursor-pointer w-full  max-w-sm sm:max-w-md md:max-w-lg lg:max-w-md xl:max-w-md"
            onClick={() => onClick(post)}
        >
            {/* Imagen */}
            <figure className="relative max-w-100 max-h-52 rounded-box overflow-hidden border border-zinc-900">
                {imageSrc ? (
                    <img
                        src={imageSrc}
                        alt={post.nombre}
                        className=" object-cover"
                    />
                ) : (
                    <div className="w-full h-48 bg-neutral flex items-center justify-center text-white opacity-40">
                        Sin imagen
                    </div>
                )}

                {/* Overlay con info */}
                <div className="absolute inset-0 bg-neutral/85 text-white p-4 sm:p-6 flex flex-col justify-between">
                    
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div className="font-bold text-sm sm:text-base truncate">
                            {post.nombre.replace('.md', '')}
                        </div>
                        <div className="text-2xl sm:text-4xl opacity-40">
                            <PiMetaLogo />
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex justify-between gap-4 mt-4">
                        <div>
                            <div className="text-xs opacity-50 uppercase">Estado</div>
                            <div className="text-sm sm:text-base">
                                {post['Publicado'] ? 'Publicado' : 'Pendiente'}
                            </div>
                        </div>

                        <div>
                            <div className="text-xs opacity-50 uppercase">Tipo</div>
                            <div className="text-sm sm:text-base truncate">
                                {post['Tipo de formato'] || 'Sin tipo'}
                            </div>
                        </div>
                    </div>

                </div>
            </figure>

            {/* Divs necesarios para efecto 3D */}
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    )
}

export default PostCard