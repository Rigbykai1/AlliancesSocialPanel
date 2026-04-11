import { useState, useEffect } from 'react'
import { useNotifications } from '../../../hooks/useNotifications'
import PostModalView from './PostModalView'
import PostModalEdit from './PostModalEdit'
import PostModalDeleteConfirm from './PostModalDeleteConfirm'
import PostModalActions from './PostModalActions'

const PostModalIndex = ({ post, onClose, onDelete, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
    const { notifySuccess, notifyError } = useNotifications()

    const [fields, setFields] = useState({
        nombre: "", fecha: "", tipo: "",
        publicado: false, contenido: "", imagen: null
    })

    useEffect(() => {
        if (!post) return
        const dialog = document.getElementById('my_modal_2')
        if (dialog && !dialog.open) dialog.showModal()

        const initialFields = {
            nombre: post.nombre || "",
            fecha: post['Fecha de publicación'] || "",
            tipo: post['Tipo de formato'] || "",
            publicado: Boolean(post['Publicado']),
            contenido: post.contenido || post.preview || "",
            imagen: null
        }

        setFields(initialFields)
        setIsEditing(false)
        setIsConfirmingDelete(false)
    }, [post?.id])

    if (!post) return null

    const handleSave = async () => {
        try {
            await onUpdate(post.id, {
                'Fecha de publicación': fields.fecha,
                fecha: fields.fecha,
                tipo: fields.tipo,
                contenido: fields.contenido,
                publicado: fields.publicado,
                imagen: fields.imagen
            })
            notifySuccess(`Post "${post.nombre}" actualizado correctamente`)
            setIsEditing(false)
            onClose()
        } catch (err) {
            notifyError('Error al actualizar post: ' + err.message)
        }
    }

    const handleConfirmDelete = async () => {
        try {
            await onDelete(post.id, post['Fecha de publicación'])
            notifySuccess(`Post "${post.nombre}" eliminado correctamente`)
            onClose()
        } catch (err) {
            notifyError('Error al eliminar post: ' + err.message)
        }
    }

    const renderContent = () => {
        if (isConfirmingDelete)
            return <PostModalDeleteConfirm postName={post.nombre} />
        if (isEditing)
            return <PostModalEdit fields={fields} onChange={setFields} postNombre={post.nombre} />
        return <PostModalView post={post} />
    }

    return (
        <dialog id="my_modal_2" className="modal px-3 sm:px-4" onClose={onClose}>
            <div className="modal-box w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl border border-base-300 bg-base-100 shadow-2xl">
                {renderContent()}
                <div className="modal-action mt-6 border-t border-base-300 pt-5">
                    <PostModalActions
                        isEditing={isEditing}
                        isConfirmingDelete={isConfirmingDelete}
                        onEdit={() => setIsEditing(true)}
                        onCancelEdit={() => setIsEditing(false)}
                        onSave={handleSave}
                        onDelete={() => setIsConfirmingDelete(true)}
                        onCancelDelete={() => setIsConfirmingDelete(false)}
                        onConfirmDelete={handleConfirmDelete}
                        onClose={onClose}
                    />
                </div>
            </div>
        </dialog>
    )
}

export default PostModalIndex