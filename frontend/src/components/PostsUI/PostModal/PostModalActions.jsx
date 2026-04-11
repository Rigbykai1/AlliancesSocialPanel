import { PiX, PiTrash, PiNotePencil } from "react-icons/pi"

const PostModalActions = ({
    isEditing,
    isConfirmingDelete,
    onEdit,
    onCancelEdit,
    onSave,
    onDelete,
    onCancelDelete,
    onConfirmDelete,
    onClose
}) => {

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
        <div className="flex gap-3 justify-center sm:justify-end w-full">
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