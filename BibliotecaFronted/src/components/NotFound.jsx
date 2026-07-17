import { Link } from "react-router-dom"
import { MdMenuBook } from "react-icons/md"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-login flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-madera-700 mb-6">
          <MdMenuBook className="text-5xl text-emerald-400" />
        </div>
        <h1 className="text-7xl font-display font-bold text-white mb-2">404</h1>
        <p className="text-xl text-madera-400 mb-8">Página no encontrada</p>
        <Link
          to="/"
          className="inline-block px-8 py-3 rounded-lg bg-madera-800 hover:bg-madera-700 text-white font-medium text-sm transition-all"
        >
          Volver al Inicio
        </Link>
      </div>
    </div>
  )
}
