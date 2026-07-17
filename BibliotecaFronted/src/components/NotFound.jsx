import { Link } from "react-router-dom"
import { MdMenuBook, MdHome } from "react-icons/md"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-madera-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-madera-800 via-madera-900 to-black" />
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
      <div className="relative z-10 text-center max-w-md">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 mb-8">
          <MdMenuBook className="text-5xl text-emerald-400" />
        </div>
        <h1 className="text-8xl font-display font-bold text-white mb-3 tracking-tighter">404</h1>
        <p className="text-xl text-madera-400 mb-10">Pagina no encontrada</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-white/10 hover:bg-white/15 text-white font-medium text-sm transition-all border border-white/10"
        >
          <MdHome className="text-lg" />
          Volver al Inicio
        </Link>
      </div>
    </div>
  )
}
