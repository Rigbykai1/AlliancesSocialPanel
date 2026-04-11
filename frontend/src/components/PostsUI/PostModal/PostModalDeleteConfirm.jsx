import { PiWarning } from "react-icons/pi"

const PostModalDeleteConfirm = ({ postName }) => {
    return (
        <div className="flex flex-col items-center justify-center gap-5 py-10 text-center">
            <div className="rounded-full bg-error/10 p-4">
                <PiWarning className="size-14 text-error" />
            </div>
            <div className="space-y-2 max-w-md">
                <h2 className="text-2xl font-bold">¿Eliminar este post?</h2>
                <p className="text-base-content/70 text-sm sm:text-base">
                    Estás a punto de eliminar <span className="font-semibold text-base-content">"{postName}"</span>.
                    Esta acción no se puede deshacer y también eliminará la imagen asociada.
                </p>
            </div>
        </div>
    )
}

export default PostModalDeleteConfirm