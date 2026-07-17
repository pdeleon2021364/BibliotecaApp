import { useState } from "react"
import { Outlet, NavLink, useNavigate } from "react-router-dom"
import { MdDashboard, MdBook, MdAssignment, MdBarChart, MdMenu, MdClose, MdMenuBook, MdLogout } from "react-icons/md"
import { logout } from "../services/auth"

const navItems = [
  { to: "/", icon: MdDashboard, label: "Dashboard" },
  { to: "/libros", icon: MdBook, label: "Libros" },
  { to: "/prestamos", icon: MdAssignment, label: "Préstamos" },
  { to: "/estadisticas", icon: MdBarChart, label: "Estadísticas" },
]

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-header h-16 flex items-center justify-between px-6 sticky top-0 z-40 shadow-warm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-madera-700 text-pergamino-100 transition-colors cursor-pointer"
          >
            {sidebarOpen ? <MdClose className="text-xl" /> : <MdMenu className="text-xl" />}
          </button>
          <div className="flex items-center gap-2">
            <MdMenuBook className="text-2xl text-bosque-500" />
            <h1 className="text-xl font-display font-bold text-pergamino-50 tracking-wide">
              BibliotecaApp
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-madera-300 hidden sm:block">Bibliotecario</span>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-madera-700 text-madera-300 hover:text-pergamino-100 transition-colors cursor-pointer"
            title="Cerrar sesión"
          >
            <MdLogout className="text-lg" />
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`
            bg-sidebar w-64 min-h-[calc(100vh-4rem)] sticky top-16
            flex flex-col py-4 border-r border-madera-700
            transition-transform duration-300 z-30
            max-md:fixed max-md:top-16 max-md:left-0 max-md:h-[calc(100vh-4rem)]
            ${sidebarOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full"}
          `}
        >
          <nav className="flex flex-col gap-1 px-3">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-madera-700 text-pergamino-50 shadow-warm-sm"
                      : "text-madera-300 hover:bg-madera-700/50 hover:text-pergamino-100"
                  }`
                }
                end={to === "/"}
              >
                <Icon className="text-xl" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto mx-3 p-4 rounded-lg bg-madera-700/30 border border-madera-600/30">
            <p className="text-xs text-madera-400 leading-relaxed">
              Sistema de Gestión de Biblioteca v1.0
            </p>
          </div>
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-20 md:hidden top-16"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 p-6 md:p-8 bg-pergamino-100 min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
