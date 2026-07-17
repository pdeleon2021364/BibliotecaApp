import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastProvider } from "./components/Toast"
import Layout from "./components/Layout"
import ProtectedRoute from "./components/ProtectedRoute"
import Login from "./pages/Login"
import Registro from "./pages/Registro"
import VerificarEmail from "./pages/VerificarEmail"
import Dashboard from "./pages/Dashboard"
import Libros from "./pages/Libros"
import Prestamos from "./pages/Prestamos"
import Estadisticas from "./pages/Estadisticas"
import NotFound from "./components/NotFound"

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/verify-email" element={<VerificarEmail />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/libros" element={<Libros />} />
              <Route path="/prestamos" element={<Prestamos />} />
              <Route path="/estadisticas" element={<Estadisticas />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  )
}
