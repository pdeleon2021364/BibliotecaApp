import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { MdMenuBook, MdEmail, MdLock } from "react-icons/md"
import { login, saveToken } from "../services/auth"

export default function Login() {
  const [form, setForm] = useState({ email: "admin@ksports.local", password: "Admin1234!" })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const validate = () => {
    const errs = {}
    if (!form.email.trim()) errs.email = "El correo es obligatorio"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Correo inválido"
    if (!form.password) errs.password = "La contraseña es obligatoria"
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
      setServerError(err.message || "Credenciales inválidas")
    } finally {
      setLoading(false)
    }
  }

  const fieldClass = (field) =>
    `w-full pl-10 pr-4 py-2.5 rounded-lg border bg-white text-madera-800 placeholder-madera-400 focus:outline-none focus:ring-2 transition-all text-sm ${
      errors[field] ? "border-peligro-600 focus:border-peligro-600 focus:ring-peligro-100" : "border-madera-200 focus:border-madera-400 focus:ring-madera-200"
    }`

  return (
    <div className="min-h-screen bg-login flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-warm border border-madera-200 overflow-hidden">
          <div className="bg-madera-800 px-8 py-10 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-madera-700 mb-4">
              <MdMenuBook className="text-4xl text-emerald-400" />
            </div>
            <h1 className="text-2xl font-display font-bold text-white tracking-wide">BibliotecaApp</h1>
            <p className="text-madera-400 text-sm mt-2">Sistema de Gestión de Biblioteca</p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
            {serverError && (
              <div className="bg-peligro-100 border border-peligro-600/30 text-peligro-600 text-sm px-4 py-3 rounded-lg">
                {serverError}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-madera-700 mb-1.5">Correo Electrónico</label>
              <div className="relative">
                <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500 text-lg" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="correo@biblioteca.com"
                  className={fieldClass("email")}
                />
              </div>
              {errors.email && <p className="text-xs text-peligro-600 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-madera-700 mb-1.5">Contraseña</label>
              <div className="relative">
                <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500 text-lg" />
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className={fieldClass("password")}
                />
              </div>
              {errors.password && <p className="text-xs text-peligro-600 mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-madera-800 hover:bg-madera-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm transition-all duration-200 cursor-pointer"
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>

            <p className="text-center text-sm text-madera-500 mt-4">
              ¿No tienes cuenta?{" "}
              <Link to="/registro" className="text-madera-800 font-medium hover:text-madera-600">
                Regístrate
              </Link>
            </p>

            <p className="text-center text-xs text-madera-400 mt-2">
              © 2026 BibliotecaApp — Todos los derechos reservados
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
