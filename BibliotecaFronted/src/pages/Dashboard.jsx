import { useState, useEffect } from "react"
import { MdBook, MdAssignment, MdAssignmentReturn, MdPeople } from "react-icons/md"
import StatsCard from "../components/StatsCard"
import Card from "../components/Card"
import Table from "../components/Table"
import { SkeletonCard } from "../components/Skeleton"
import { statsApi } from "../services/api"

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    statsApi.getSummary()
      .then((res) => setSummary(res.data || null))
      .catch(() => setSummary(null))
      .finally(() => setLoading(false))
  }, [])

  const s = summary || {}

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
          <StatsCard title="Total Libros" value={s.totalBooks || 0} icon={MdBook} color="madera" />
          <StatsCard title="Préstamos Activos" value={s.activeLoans || 0} icon={MdAssignment} color="bosque" />
          <StatsCard title="Libros Disponibles" value={s.availableBooks || 0} icon={MdAssignmentReturn} color="maderaLight" />
          <StatsCard title="Categorías" value={s.totalCategories || 0} icon={MdPeople} color="maderaDark" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top categorías */}
        <Card>
          <h2 className="text-lg font-display font-bold text-madera-900 mb-4">Top Categorías por Préstamos</h2>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-4 bg-madera-200 rounded animate-pulse" />
              ))}
            </div>
          ) : s.topCategories?.length > 0 ? (
            <div className="space-y-3">
              {s.topCategories.map((cat, i) => (
                <div key={i} className="flex items-center justify-between pb-3 border-b border-madera-200 last:border-0">
                  <span className="text-sm text-madera-700 font-medium">{cat._id}</span>
                  <span className="text-sm text-madera-500 font-semibold">{cat.totalPrestamos} préstamos</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-madera-400 text-sm">Sin datos disponibles</p>
          )}
        </Card>

        {/* Resumen rápido */}
        <Card>
          <h2 className="text-lg font-display font-bold text-madera-900 mb-4">Resumen Rápido</h2>
          <div className="space-y-3">
            <div className="flex justify-between pb-3 border-b border-madera-200">
              <span className="text-sm text-madera-500">Total Préstamos</span>
              <span className="text-sm font-semibold text-madera-900">{s.totalLoans || 0}</span>
            </div>
            <div className="flex justify-between pb-3 border-b border-madera-200">
              <span className="text-sm text-madera-500">Préstamos Devueltos</span>
              <span className="text-sm font-semibold text-madera-900">{s.returnedLoans || 0}</span>
            </div>
            <div className="flex justify-between pb-3 border-b border-madera-200">
              <span className="text-sm text-madera-500">Devoluciones Totales</span>
              <span className="text-sm font-semibold text-madera-900">{s.totalReturns || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-madera-500">Categorías</span>
              <span className="text-sm font-semibold text-madera-900">{s.totalCategories || 0}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
