import { useState, useEffect } from "react"
import { MdBook, MdAssignment, MdAssignmentReturn, MdPeople } from "react-icons/md"
import StatsCard from "../components/StatsCard"
import Card from "../components/Card"
import Table from "../components/Table"
import { SkeletonCard, SkeletonTable } from "../components/Skeleton"
import { statsApi } from "../services/api"
import { stats, actividadReciente, prestamos } from "../data/mockData"

const columns = [
  { key: "libro", label: "Libro" },
  { key: "usuario", label: "Usuario" },
  { key: "fechaPrestamo", label: "Fecha Préstamo" },
  {
    key: "estado",
    label: "Estado",
    render: (val) => {
      const styles = {
        activo: "bg-pergamino-200 text-madera-700",
        devuelto: "bg-bosque-100 text-bosque-700",
        vencido: "bg-peligro-100 text-peligro-600",
      }
      return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${styles[val] || "bg-madera-100 text-madera-600"}`}>
          {val?.charAt(0).toUpperCase() + val?.slice(1)}
        </span>
      )
    },
  },
]

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    statsApi.getSummary()
      .then(setSummary)
      .catch(() => setSummary(null))
      .finally(() => setLoading(false))
  }, [])

  const s = summary || stats
  const prestamosRecientes = prestamos.slice(0, 5)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-madera-800">Dashboard</h1>
        <p className="text-madera-500 mt-1 text-sm">Resumen general de la biblioteca</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Libros" value={s.totalLibros} icon={MdBook} color="madera" />
          <StatsCard title="Préstamos Activos" value={s.prestamosActivos || s.librosPrestados} icon={MdAssignment} color="bosque" />
          <StatsCard title="Devueltos Hoy" value={s.devueltosHoy} icon={MdAssignmentReturn} color="maderaLight" />
          <StatsCard title="Usuarios" value={s.totalUsuarios || s.usuarios} icon={MdPeople} color="maderaDark" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <h2 className="text-sm font-semibold text-madera-800 uppercase tracking-wider mb-4">Actividad Reciente</h2>
          <div className="space-y-3">
            {actividadReciente.map((item) => (
              <div key={item.id} className="flex items-start gap-3 pb-3 border-b border-madera-100 last:border-0">
                <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0" />
                <div>
                  <p className="text-sm text-madera-700">{item.texto}</p>
                  <p className="text-xs text-madera-400 mt-0.5">{item.tiempo}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-madera-800 uppercase tracking-wider mb-4">Últimos Préstamos</h2>
          <Table columns={columns} data={prestamosRecientes} />
        </Card>
      </div>
    </div>
  )
}
