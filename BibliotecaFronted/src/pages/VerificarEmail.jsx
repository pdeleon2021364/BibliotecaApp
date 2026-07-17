import { useState, useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { MdMenuBook, MdCheckCircle, MdError } from "react-icons/md"

export default function VerificarEmail() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState("loading")

  useEffect(() => {
    const token = searchParams.get("token")
    if (!token) {
      setStatus("no-token")
      return
    }

    fetch(`http://localhost:5156/api/v1/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => {
        if (res.ok) setStatus("success")
        else setStatus("error")
      })
      .catch(() => setStatus("error"))
  }, [searchParams])

  return (
    <div className="min-h-screen bg-login flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-pergamino-50 rounded-2xl shadow-warm border-2 border-madera-300 overflow-hidden">
          <div className="bg-madera-800 px-8 py-10 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-madera-700 mb-4 shadow-warm-sm">
              <MdMenuBook className="text-4xl text-bosque-500" />
            </div>
            <h1 className="text-3xl font-display font-bold text-pergamino-50 tracking-wide">Verificación de Email</h1>
          </div>

          <div className="px-8 py-10 text-center">
            {status === "loading" && (
              <p className="text-madera-600">Verificando tu correo...</p>
            )}

            {status === "success" && (
              <div className="space-y-4">
                <MdCheckCircle className="text-6xl text-bosque-600 mx-auto" />
                <p className="text-madera-700 font-semibold">Correo verificado correctamente</p>
                <Link to="/login" className="inline-block py-2.5 px-6 rounded-lg bg-bosque-700 hover:bg-bosque-600 text-white font-semibold text-sm transition-all">
                  Iniciar Sesión
                </Link>
              </div>
            )}

            {(status === "error" || status === "no-token") && (
              <div className="space-y-4">
                <MdError className="text-6xl text-peligro-600 mx-auto" />
                <p className="text-madera-700 font-semibold">
                  {status === "no-token" ? "Token no proporcionado" : "Error al verificar el correo"}
                </p>
                <Link to="/login" className="inline-block py-2.5 px-6 rounded-lg bg-bosque-700 hover:bg-bosque-600 text-white font-semibold text-sm transition-all">
                  Volver al Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
