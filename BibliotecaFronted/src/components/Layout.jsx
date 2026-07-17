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
      <header className="bg-header h-16 flex items-center justify-between px-6 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-madera-700 text-madera-300 transition-colors cursor-pointer"
          >
            {sidebarOpen ? <MdClose className="text-xl" /> : <MdMenu className="text-xl" />}
          </button>
          <div className="flex items-center gap-2">
            <MdMenuBook className="text-2xl text-emerald-400" />
            <h1 className="text-xl font-display font-bold text-white tracking-wide">
              BibliotecaApp
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-madera-400 hidden sm:block">Bibliotecario</span>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-madera-700 text-madera-400 hover:text-white transition-colors cursor-pointer"
            title="Cerrar sesión"
          >
            <MdLogout className="text-lg" />
          </button>
        </div>
      </header>

      <div className="flex flex-1">
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
                      ? "bg-white/10 text-white"
                      : "text-madera-400 hover:bg-white/5 hover:text-white"
                  }`
                }
                end={to === "/"}
              >
                <Icon className="text-xl" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto mx-3 p-4 rounded-lg bg-white/5 border border-white/10">
            <p className="text-xs text-madera-500 leading-relaxed">
              Sistema de Gestión de Biblioteca v1.0
            </p>
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-20 md:hidden top-16"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 p-6 md:p-8 bg-madera-100 min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
