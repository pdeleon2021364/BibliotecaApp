import { useState, useCallback, createContext, useContext } from "react"
import { MdCheckCircle, MdError, MdInfo, MdClose } from "react-icons/md"

const ToastContext = createContext()

const icons = {
  success: MdCheckCircle,
  error: MdError,
  info: MdInfo,
}

const styles = {
  success: "bg-bosque-700 text-white",
  error: "bg-peligro-600 text-white",
  info: "bg-madera-700 text-white",
}

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = "success", duration = 3500) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duration)
  }, [])

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm">
        {toasts.map((toast) => {
          const Icon = icons[toast.type]
          return (
            <div
              key={toast.id}
              className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-warm animate-slide-in ${styles[toast.type]}`}
            >
              <Icon className="text-xl shrink-0" />
              <p className="text-sm font-medium flex-1">{toast.message}</p>
              <button onClick={() => removeToast(toast.id)} className="shrink-0 opacity-70 hover:opacity-100 cursor-pointer">
                <MdClose className="text-lg" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
