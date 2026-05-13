import { PiX, PiTrash, PiNotePencil, PiMetaLogo, PiCheckCircle, PiCircle } from "react-icons/pi"

const PostModalActions = ({
    isEditing,
    isConfirmingDelete,
    onEdit,
    onCancelEdit,
    onSave,
    onDelete,
    onCancelDelete,
    onConfirmDelete,
    onClose,
    onTogglePublished,
    post,
}) => {
    const isPublished = post && (post['Publicado'] === true || post['Publicado'] === 'true' || post['Publicado'] === '1' || post['Publicado'] === 1)

    if (isConfirmingDelete) {
        return (
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end w-full">
                <button className="btn btn-outline w-full sm:w-auto" onClick={onCancelDelete}>
                    Cancelar
                </button>
                <button className="btn btn-error w-full sm:w-auto" onClick={onConfirmDelete}>
                    <PiTrash />
                    Sí, eliminar
                </button>
            </div>
        )
    }

    if (isEditing) {
        return (
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end w-full">
                <button className="btn btn-outline w-full sm:w-auto" onClick={onCancelEdit}>
                    Cancelar
                </button>
                <button className="btn btn-primary w-full sm:w-auto" onClick={onSave}>
                    Guardar cambios
                </button>
            </div>
        )
    }

    return (
        <div className="flex gap-3 justify-center sm:justify-end w-full flex-wrap">
            <div className="tooltip" data-tip={isPublished ? 'Marcar como pendiente' : 'Marcar como publicado'}>
                <button
                    className={`btn btn-outline ${isPublished ? 'btn-success' : 'btn-warning'}`}
                    onClick={() => onTogglePublished?.(post)}
                >
                    {isPublished ? <PiCheckCircle /> : <PiCircle />}
                    {isPublished ? 'Publicado' : 'Pendiente'}
                </button>
            </div>

            <div className="tooltip" data-tip="Editar post">
                <button
                    className="btn btn-outline hover:btn-primary"
                    onClick={onEdit}
                >
                    <PiNotePencil />
                    Editar
                </button>
            </div>

            <div className="tooltip" data-tip="Eliminar post">
                <button
                    className="btn btn-outline hover:btn-error"
                    onClick={onDelete}
                >
                    <PiTrash />
                    Eliminar
                </button>
            </div>

            <div className="tooltip" data-tip="Cerrar modal">
                <button
                    className="btn btn-outline"
                    onClick={onClose}
                >
                    <PiX />
                    Cerrar
                </button>
            </div>
        </div>
    )
}

export default PostModalActions