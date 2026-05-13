import { useEffect, useRef, useState } from 'react'
import { PiImageSquare } from 'react-icons/pi'

const ImageUploadPreview = ({
  image,
  onChange,
  label = 'Imagen',
  accept = 'image/*',
  hint = 'JPG, PNG · máx. 5 MB'
}) => {
  const [previewUrl, setPreviewUrl] = useState(null)
  const fileInputRef = useRef(null)
  const changeInputRef = useRef(null)

  useEffect(() => {
    if (!(image instanceof File)) {
      setPreviewUrl(null)
      return
    }

    const objectUrl = URL.createObjectURL(image)
    setPreviewUrl(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [image])

  const handleChange = (e) => {
    const file = e.target.files?.[0] ?? null
    onChange(file)
  }

  const handleRemove = () => {
    onChange(null)
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (changeInputRef.current) changeInputRef.current.value = ''
  }

  return (
    <div className='space-y-3'>
      <span className='label-text font-semibold'>{label}</span>
      <div
        className={`relative rounded-xl bg-base-100 overflow-hidden transition-all ${previewUrl
          ? 'border border-base-300'
          : 'border-2 border-dashed border-base-300 hover:border-primary/40 cursor-pointer'
        }`}
        onClick={() => !previewUrl && fileInputRef.current?.click()}
      >
        {previewUrl ? (
          <div className='flex flex-col items-center'>
            <img
              src={previewUrl}
              alt='Vista previa'
              className='w-full max-h-48 object-contain p-2'
            />
            <div className='flex gap-2 justify-center py-2'>
              <label className='btn btn-outline btn-sm cursor-pointer'>
                Cambiar imagen
                <input
                  ref={changeInputRef}
                  type='file'
                  accept={accept}
                  onChange={handleChange}
                  className='hidden'
                />
              </label>
              <button
                type='button'
                onClick={handleRemove}
                className='btn btn-ghost btn-sm'
              >
                Eliminar
              </button>
            </div>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center gap-2 py-8 text-base-content/40'>
            <PiImageSquare className='size-8' />
            <p className='text-sm'>Haz clic para subir una imagen</p>
            <p className='text-xs'>{hint}</p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type='file'
        accept={accept}
        onChange={handleChange}
        className='hidden'
        aria-label={label}
      />
    </div>
  )
}

export default ImageUploadPreview
