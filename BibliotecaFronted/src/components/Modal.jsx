import { MdClose } from "react-icons/md"

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-warm border border-madera-200 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-madera-100">
          <h2 className="text-lg font-display font-semibold text-madera-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-madera-100 text-madera-400 hover:text-madera-700 transition-colors cursor-pointer"
          >
            <MdClose className="text-xl" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}
