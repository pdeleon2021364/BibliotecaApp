import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { MdMenuBook, MdPerson, MdEmail, MdLock } from "react-icons/md"
import { register, saveToken } from "../services/auth"

export default function Registro() {
  const [form, setForm] = useState({ name: "", surname: "", username: "", email: "", password: "", confirmPassword: "" })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = "El nombre es obligatorio"
    if (!form.surname.trim()) errs.surname = "El apellido es obligatorio"
    if (!form.username.trim()) errs.username = "El usuario es obligatorio"
    if (!form.email.trim()) errs.email = "El correo es obligatorio"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Correo inválido"
    if (!form.password) errs.password = "La contraseña es obligatoria"
    else if (form.password.length < 6) errs.password = "Mínimo 6 caracteres"
    if (form.password !== form.confirmPassword) errs.confirmPassword = "Las contraseñas no coinciden"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError("")
    if (!validate()) return

    setLoading(true)
    try {
      const res = await register({ name: form.name, surname: form.surname, username: form.username, email: form.email, password: form.password })
      if (res.accessToken) saveToken(res.accessToken)
      navigate("/")
    } catch (err) {
      setServerError(err.message || "Error al registrar usuario")
    } finally {
      setLoading(false)
    }
  }

  const fieldClass = (field) =>
    `w-full px-4 py-2.5 rounded-lg border-2 bg-white text-madera-800 placeholder-madera-400 focus:outline-none focus:ring-2 transition-all text-sm ${
      errors[field] ? "border-peligro-600 focus:border-peligro-600 focus:ring-peligro-100" : "border-madera-300 focus:border-bosque-500 focus:ring-bosque-100"
    }`

  return (
    <div className="min-h-screen bg-login flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-pergamino-50 rounded-2xl shadow-warm border-2 border-madera-300 overflow-hidden">
          <div className="bg-madera-800 px-8 py-10 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-madera-700 mb-4 shadow-warm-sm">
              <MdMenuBook className="text-4xl text-bosque-500" />
            </div>
            <h1 className="text-3xl font-display font-bold text-pergamino-50 tracking-wide">Crear Cuenta</h1>
            <p className="text-madera-300 text-sm mt-2">Regístrate para acceder al sistema</p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-4">
            {serverError && (
              <div className="bg-peligro-100 border border-peligro-600 text-peligro-600 text-sm px-4 py-3 rounded-lg">
                {serverError}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-madera-700 mb-1.5">Nombre</label>
                <div className="relative">
                  <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-madera-400 text-lg" />
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Juan" className={`${fieldClass("name")} pl-10`} />
                </div>
                {errors.name && <p className="text-xs text-peligro-600 mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-madera-700 mb-1.5">Apellido</label>
                <div className="relative">
                  <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-madera-400 text-lg" />
                  <input type="text" value={form.surname} onChange={(e) => setForm({ ...form, surname: e.target.value })} placeholder="Pérez" className={`${fieldClass("surname")} pl-10`} />
                </div>
                {errors.surname && <p className="text-xs text-peligro-600 mt-1">{errors.surname}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-madera-700 mb-1.5">Usuario</label>
              <div className="relative">
                <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-madera-400 text-lg" />
                <input type="text" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="juanperez" className={`${fieldClass("username")} pl-10`} />
              </div>
              {errors.username && <p className="text-xs text-peligro-600 mt-1">{errors.username}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-madera-700 mb-1.5">Correo electrónico</label>
              <div className="relative">
                <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-madera-400 text-lg" />
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="correo@biblioteca.com" className={`${fieldClass("email")} pl-10`} />
              </div>
              {errors.email && <p className="text-xs text-peligro-600 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-madera-700 mb-1.5">Contraseña</label>
              <div className="relative">
                <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-madera-400 text-lg" />
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Mínimo 6 caracteres" className={`${fieldClass("password")} pl-10`} />
              </div>
              {errors.password && <p className="text-xs text-peligro-600 mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-madera-700 mb-1.5">Confirmar contraseña</label>
              <div className="relative">
                <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-madera-400 text-lg" />
                <input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} placeholder="Repite tu contraseña" className={`${fieldClass("confirmPassword")} pl-10`} />
              </div>
              {errors.confirmPassword && <p className="text-xs text-peligro-600 mt-1">{errors.confirmPassword}</p>}
            </div>

            <button type="submit" disabled={loading} className="w-full py-3 rounded-lg bg-bosque-700 hover:bg-bosque-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all duration-200 shadow-warm-sm hover:shadow-warm cursor-pointer">
              {loading ? "Creando cuenta..." : "Registrarse"}
            </button>

            <p className="text-center text-sm text-madera-500 mt-4">
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="text-bosque-700 font-semibold hover:text-bosque-600">Iniciar Sesión</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
