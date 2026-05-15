import { PiX, PiTrash, PiNotePencil, PiMetaLogo, PiCheckCircle, PiCircle, PiSignpost, PiImage, PiCopy, PiClipboard } from "react-icons/pi"
import { useNotifications } from '../../../hooks/useNotifications'
import { useMemo } from "react"

const splitPostText = (text) => {
    if (!text) return { texto: '', diseno: '' }

    const normalized = text.replace(/\r\n/g, '\n')
    const regex = /(\n|^)🎨\s*Diseñ[ao]\s*IA\s*:?/i
    const match = normalized.match(regex)

    if (!match) {
        return { texto: normalized.trim(), diseno: '' }
    }

    const index = match.index
    const texto = normalized.slice(0, index).trim()
    const diseno = normalized.slice(index).trim()
    return { texto, diseno }
}

const PostModalActions = ({
    isEditing,
    isConfirmingDelete,
    onEdit,
    onDelete,
    onCancelDelete,
    onConfirmDelete,
    onClose,
    onTogglePublished,
    post,
}) => {
    const isPublished = post && (post['Publicado'] === true || post['Publicado'] === 'true' || post['Publicado'] === '1' || post['Publicado'] === 1)
    const rawContent = (post.contenido || post.preview || post['Contenido'] || '').trim()
    const { texto, diseno } = useMemo(() => splitPostText(rawContent), [rawContent])
    const fullContent = useMemo(() => {
        if (!texto && !diseno) return rawContent
        if (texto && diseno) return `${texto}\n\n${diseno}`.trim()
        return texto || diseno || rawContent
    }, [rawContent, texto, diseno])
    const { notifySuccess, notifyError } = useNotifications()


    const copyToClipboard = async (value, label) => {
        if (!value) {
            notifyError(`No hay ${label.toLowerCase()} para copiar.`)
            return
        }
        try {
            await navigator.clipboard.writeText(value)
            notifySuccess(`${label} copiado correctamente`)
        } catch (err) {
            notifyError(`Error al copiar ${label}`)
        }
    }
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
            null
        )
    }

    return (
        <div className="flex gap-3 justify-center sm:justify-end w-full flex-wrap">
            <details className="dropdown dropdown-top dropdown-start sm:dropdown-center">
                <summary className="btn btn-outline tooltip tooltip-right sm:tooltip-left" data-tip="Copiar">
                    <PiClipboard />
                </summary>
                <ul className="menu dropdown-content bg-base-200 rounded-box z-1 w-52 p-2 shadow-sm mb-2">
                    <li>
                        <a onClick={() => copyToClipboard(texto || rawContent, 'Texto del post')}>
                            📌 Texto del post
                        </a>
                    </li>
                    <li>
                        <a onClick={() => copyToClipboard(diseno || rawContent, 'Diseño IA')}>
                            🎨 Diseño IA
                        </a>
                    </li>
                    <li>
                        <a onClick={() => copyToClipboard(fullContent, 'Texto completo')}>
                            📝 Copiar todo
                        </a>
                    </li>
                </ul>
            </details>
            <div className="tooltip" data-tip={isPublished ? 'Marcar como pendiente' : 'Marcar como publicado'}>
                <button
                    className={`btn btn-outline ${isPublished ? 'btn-success' : 'btn-warning'}`}
                    onClick={() => onTogglePublished?.(post)}
                >
                    {isPublished ? <PiCheckCircle /> : <PiCircle />}
                </button>
            </div>
            <div className="tooltip" data-tip="Editar post">
                <button
                    className="btn btn-outline hover:btn-primary"
                    onClick={onEdit}
                >
                    <PiNotePencil />
                </button>
            </div>

            <div className="tooltip" data-tip="Eliminar post">
                <button
                    className="btn btn-outline hover:btn-error"
                    onClick={onDelete}
                >
                    <PiTrash />
                </button>
            </div>
            <div className="tooltip" data-tip="Cerrar modal">
                <button
                    className="btn btn-outline"
                    onClick={onClose}
                >
                    <PiX />
                </button>
            </div>
        </div>
    )
}

export default PostModalActions