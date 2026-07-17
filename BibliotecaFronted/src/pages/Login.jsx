import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { MdMenuBook, MdEmail, MdLock, MdVisibility, MdVisibilityOff } from "react-icons/md"
import { login, saveToken } from "../services/auth"

export default function Login() {
  const [form, setForm] = useState({ email: "admin@ksports.local", password: "Admin1234!" })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
  const navigate = useNavigate()

  const validate = () => {
    const errs = {}
    if (!form.email.trim()) errs.email = "El correo es obligatorio"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Correo invalido"
    if (!form.password) errs.password = "La contrasena es obligatoria"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError("")
    if (!validate()) return

    setLoading(true)
    try {
      const res = await login({ correo: form.email, contrasena: form.password })
      if (res.token) saveToken(res.token)
      navigate("/")
    } catch (err) {
      setServerError(err.message || "Credenciales invalidas")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-madera-900 flex">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulse-soft {
          0%, 100% { opacity: 0.03; }
          50% { opacity: 0.06; }
        }
        .anim-fade-in { animation: fadeIn 0.6s ease-out both; }
        .anim-fade-in-up-1 { animation: fadeInUp 0.5s ease-out 0.1s both; }
        .anim-fade-in-up-2 { animation: fadeInUp 0.5s ease-out 0.2s both; }
        .anim-fade-in-up-3 { animation: fadeInUp 0.5s ease-out 0.3s both; }
        .anim-fade-in-up-4 { animation: fadeInUp 0.5s ease-out 0.4s both; }
        .anim-fade-in-up-5 { animation: fadeInUp 0.5s ease-out 0.5s both; }
        .anim-slide-left { animation: slideInLeft 0.8s ease-out 0.2s both; }
        .input-ring { transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
        .input-ring:focus { box-shadow: 0 0 0 3px rgba(113, 132, 114, 0.12); }
        .btn-shine { position: relative; overflow: hidden; }
        .btn-shine::after {
          content: '';
          position: absolute;
          top: -50%; left: -75%;
          width: 50%; height: 200%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          transform: rotate(25deg);
          transition: left 0.6s ease;
        }
        .btn-shine:hover::after { left: 125%; }
        .pattern-anim { animation: pulse-soft 8s ease-in-out infinite; }
      `}</style>

      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-madera-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-madera-800 via-madera-900 to-black" />
        <div className="absolute inset-0 opacity-[0.03] pattern-anim" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-12">
          <div className="anim-slide-left w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-8 border border-white/10 hover:bg-white/15 hover:scale-105 transition-all duration-300">
            <MdMenuBook className="text-4xl text-emerald-400" />
          </div>
          <h1 className="anim-slide-left text-4xl font-display font-bold text-white tracking-wide mb-3" style={{ animationDelay: "0.35s" }}>
            BibliotecaApp
          </h1>
          <p className="anim-slide-left text-madera-400 text-center text-lg max-w-sm leading-relaxed" style={{ animationDelay: "0.5s" }}>
            Sistema de gestion bibliotecaria para administrar libros, prestamos y mas.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-8 text-center">
            <div className="anim-fade-in" style={{ animationDelay: "0.6s" }}>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
                <MdMenuBook className="text-emerald-400 text-xl" />
              </div>
              <p className="text-xs text-madera-500">Libros</p>
            </div>
            <div className="anim-fade-in" style={{ animationDelay: "0.75s" }}>
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center mx-auto mb-3">
                <MdEmail className="text-sky-400 text-xl" />
              </div>
              <p className="text-xs text-madera-500">Usuarios</p>
            </div>
            <div className="anim-fade-in" style={{ animationDelay: "0.9s" }}>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mx-auto mb-3">
                <MdLock className="text-amber-400 text-xl" />
              </div>
              <p className="text-xs text-madera-500">Prestamos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-pergamino-100">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center anim-fade-in-up-1">
            <div className="w-10 h-10 rounded-xl bg-madera-800 flex items-center justify-center hover:scale-105 transition-transform duration-300">
              <MdMenuBook className="text-xl text-emerald-400" />
            </div>
            <span className="text-xl font-display font-bold text-madera-800">BibliotecaApp</span>
          </div>

          <div className="anim-fade-in-up-1">
            <h2 className="text-2xl font-display font-bold text-madera-900">Bienvenido</h2>
            <p className="text-madera-500 mt-1 text-sm">Ingresa tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {serverError && (
              <div className="anim-fade-in-up-1 bg-peligro-100 border border-peligro-600/20 text-peligro-600 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-peligro-600 shrink-0 animate-pulse" />
                {serverError}
              </div>
            )}

            <div className="anim-fade-in-up-2">
              <label className="block text-sm font-medium text-madera-700 mb-1.5">Correo electronico</label>
              <div className="relative group">
                <MdEmail className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 ${focusedField === "email" ? "text-emerald-500" : "text-amber-500"}`} />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="correo@biblioteca.com"
                  className={`input-ring w-full pl-11 pr-4 py-3 rounded-lg border bg-white text-madera-800 placeholder-madera-400 focus:outline-none focus:ring-2 transition-all duration-200 text-sm hover:border-madera-300 ${
                    errors.email ? "border-peligro-600 focus:border-peligro-600 focus:ring-peligro-100" : "border-madera-200 focus:border-madera-400 focus:ring-madera-200"
                  }`}
                />
              </div>
              {errors.email && <p className="text-xs text-peligro-600 mt-1 anim-fade-in">{errors.email}</p>}
            </div>

            <div className="anim-fade-in-up-3">
              <label className="block text-sm font-medium text-madera-700 mb-1.5">Contrasena</label>
              <div className="relative group">
                <MdLock className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 ${focusedField === "password" ? "text-emerald-500" : "text-amber-500"}`} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Tu contrasena"
                  className={`input-ring w-full pl-11 pr-11 py-3 rounded-lg border bg-white text-madera-800 placeholder-madera-400 focus:outline-none focus:ring-2 transition-all duration-200 text-sm hover:border-madera-300 ${
                    errors.password ? "border-peligro-600 focus:border-peligro-600 focus:ring-peligro-100" : "border-madera-200 focus:border-madera-400 focus:ring-madera-200"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-madera-400 hover:text-madera-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <MdVisibilityOff className="text-lg" /> : <MdVisibility className="text-lg" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-peligro-600 mt-1 anim-fade-in">{errors.password}</p>}
            </div>

            <div className="anim-fade-in-up-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-shine w-full py-3 rounded-lg bg-madera-800 hover:bg-madera-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm transition-all duration-200 cursor-pointer active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Iniciando sesion...
                  </span>
                ) : "Iniciar Sesion"}
              </button>
            </div>

            <div className="anim-fade-in-up-5">
              <p className="text-center text-sm text-madera-500">
                No tienes cuenta?{" "}
                <Link to="/registro" className="text-madera-800 font-medium hover:text-madera-600 transition-colors duration-200">
                  Registrate
                </Link>
              </p>
            </div>
          </form>

          <p className="text-center text-xs text-madera-400 mt-8 anim-fade-in-up-5">
            2026 BibliotecaApp. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}
