import { useState, useEffect } from "react"
import { MdBook, MdAssignment, MdAssignmentReturn, MdPeople } from "react-icons/md"
import StatsCard from "../components/StatsCard"
import Card from "../components/Card"
import Table from "../components/Table"
import { SkeletonCard, SkeletonTable } from "../components/Skeleton"
import { booksApi, loansApi, statsApi } from "../services/api"

export default function Dashboard() {
  const [summary, setSummary] = useState({ totalLibros: 0, prestamosActivos: 0, totalPrestamos: 0, totalUsuarios: 0 })
  const [recentLoans, setRecentLoans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [booksRes, loansRes, catsRes] = await Promise.all([
          booksApi.getAll({ limit: 1 }),
          loansApi.getMyLoans({ limit: 5 }),
          statsApi.getStatisticsByCategory(),
        ])
        setSummary({
          totalLibros: booksRes.pagination?.totalRecords || 0,
          prestamosActivos: (loansRes.data || []).filter(l => l.estado === "activo").length,
          totalPrestamos: loansRes.pagination?.totalRecords || 0,
          totalCategorias: (catsRes.data || []).length,
        })
        setRecentLoans(loansRes.data || [])
      } catch {
        // keep defaults
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const formatDate = (dateStr) => {
    if (!dateStr) return ""
    return new Date(dateStr).toLocaleDateString("es-GT")
  }

  const columns = [
    {
      key: "libroId",
      label: "Libro",
      render: (val) => val?.titulo || "N/A",
    },
    {
      key: "usuarioId",
      label: "Usuario",
      render: (val) => val?.nombre || "N/A",
    },
    {
      key: "fechaPrestamo",
      label: "Fecha Préstamo",
      render: (val) => formatDate(val),
    },
    {
      key: "estado",
      label: "Estado",
      render: (val) => {
        const styles = {
          activo: "bg-madera-200 text-madera-700",
          devuelto: "bg-bosque-100 text-bosque-700",
        }
        return (
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${styles[val] || "bg-madera-200 text-madera-700"}`}>
            {val?.charAt(0).toUpperCase() + val?.slice(1)}
          </span>
        )
      },
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-madera-900">Dashboard</h1>
        <p className="text-madera-500 mt-1">Resumen general de la biblioteca</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Libros" value={summary.totalLibros} icon={MdBook} color="madera" />
          <StatsCard title="Mis Préstamos Activos" value={summary.prestamosActivos} icon={MdAssignment} color="bosque" />
          <StatsCard title="Total Mis Préstamos" value={summary.totalPrestamos} icon={MdAssignmentReturn} color="maderaLight" />
          <StatsCard title="Categorías" value={summary.totalCategorias} icon={MdPeople} color="maderaDark" />
        </div>
      )}

      <Card>
        <h2 className="text-lg font-display font-bold text-madera-900 mb-4">Mis Últimos Préstamos</h2>
        {loading ? (
          <SkeletonTable rows={5} cols={4} />
        ) : recentLoans.length > 0 ? (
          <Table columns={columns} data={recentLoans} />
        ) : (
          <p className="text-madera-400 text-sm">No tienes préstamos registrados aún.</p>
        )}
      </Card>
    </div>
  )
}
