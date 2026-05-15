const Modal = ({ isOpen, onClose, children, className = '' }) => {
  return (
    <dialog open={isOpen} className={`modal px-3 sm:px-4 ${className}`} onClose={onClose}>
      <div className="modal-box w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl border border-base-300 bg-base-100 shadow-2xl">
        {children}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}

export default Modal
