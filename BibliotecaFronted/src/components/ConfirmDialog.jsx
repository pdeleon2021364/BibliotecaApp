import { MdWarning } from "react-icons/md"
import Button from "./Button"
import Modal from "./Modal"

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title || "Confirmar acción"}>
      <div className="space-y-5">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-peligro-100 shrink-0">
            <MdWarning className="text-xl text-peligro-600" />
          </div>
          <p className="text-sm text-madera-700 leading-relaxed pt-1">
            {message || "¿Estás seguro de que deseas realizar esta acción? Esta acción no se puede deshacer."}
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={() => { onConfirm(); onClose() }}>
            Eliminar
          </Button>
        </div>
      </div>
    </Modal>
  )
}
