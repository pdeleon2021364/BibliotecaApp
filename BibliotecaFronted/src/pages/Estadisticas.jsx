import { useState, useEffect } from "react"
import { MdBarChart, MdCategory, MdAutoAwesome, MdSummarize, MdRefresh, MdBook } from "react-icons/md"
import Card from "../components/Card"
import Button from "../components/Button"
import { SkeletonCard, SkeletonBarChart } from "../components/Skeleton"
import { statsApi } from "../services/api"
import { useToast } from "../components/Toast"

const categorias = ["Novela", "Clásico", "Cuento", "Fábula", "Poesía", "Ensayo"]

function BarChart({ data, maxVal, labelKey, valueKey }) {
  return (
    <div className="space-y-3">
      {data.map((item, i) => (
        <div key={i} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-madera-700 font-medium">{item[labelKey]}</span>
            <span className="text-madera-500 font-semibold">{item[valueKey]}</span>
          </div>
          <div className="w-full h-3 bg-madera-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-bosque-600 to-bosque-500 rounded-full transition-all duration-700"
              style={{ width: `${maxVal > 0 ? (item[valueKey] / maxVal) * 100 : 0}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function StatMini({ label, value, color }) {
  const colors = {
    verde: "bg-bosque-100 text-bosque-700",
    madera: "bg-madera-100 text-madera-700",
    peligro: "bg-peligro-100 text-peligro-600",
    oro: "bg-pergamino-200 text-madera-800",
  }
  return (
    <div className={`rounded-xl p-4 ${colors[color]}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs font-medium mt-1 opacity-80">{label}</p>
    </div>
  )
}

export default function Estadisticas() {
  const [statistics, setStatistics] = useState(null)
  const [categories, setCategories] = useState(null)
  const [summary, setSummary] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [latestBooks, setLatestBooks] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("Novela")
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  const fetchData = async () => {
    setLoading(true)
    try {
      const [statsRes, catsRes, sumRes, latestRes] = await Promise.all([
        statsApi.getStatistics().catch(() => ({ data: [] })),
        statsApi.getStatisticsByCategory().catch(() => ({ data: [] })),
        statsApi.getSummary().catch(() => ({ data: {} })),
        statsApi.getLatest(5).catch(() => ({ data: [] })),
      ])
      setStatistics(statsRes.data || [])
      setCategories(catsRes.data || [])
      setSummary(sumRes.data || {})
      setLatestBooks(latestRes.data || [])
    } catch {
      toast("Error al cargar estadísticas", "error")
    }
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  useEffect(() => {
    statsApi.getRecommendations(selectedCategory)
      .then((res) => setRecommendations(res.data || []))
      .catch(() => setRecommendations([]))
  }, [selectedCategory])

  const maxCat = categories ? Math.max(...categories.map(c => c.totalPrestamos || 0)) : 1
  const s = summary || {}

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-madera-900">Estadísticas y Recomendaciones</h1>
          <p className="text-madera-500 mt-1">Información general de la biblioteca</p>
        </div>
        <Button variant="ghost" icon={MdRefresh} onClick={fetchData}>
          Actualizar
        </Button>
      </div>

      {/* Summary */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <Card>
          <div className="flex items-center gap-2 mb-5">
            <MdSummarize className="text-xl text-bosque-600" />
            <h2 className="text-lg font-display font-bold text-madera-900">Resumen General</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatMini label="Total Libros" value={s.totalBooks || 0} color="madera" />
            <StatMini label="Disponibles" value={s.availableBooks || 0} color="verde" />
            <StatMini label="Préstamos Totales" value={s.totalLoans || 0} color="oro" />
            <StatMini label="Devoluciones" value={s.totalReturns || 0} color="peligro" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
            <StatMini label="Préstamos Activos" value={s.activeLoans || 0} color="verde" />
            <StatMini label="Préstamos Devueltos" value={s.returnedLoans || 0} color="madera" />
            <StatMini label="Categorías" value={s.totalCategories || 0} color="madera" />
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories */}
        {loading ? (
          <Card><SkeletonBarChart bars={5} /></Card>
        ) : categories.length > 0 ? (
          <Card>
            <div className="flex items-center gap-2 mb-5">
              <MdCategory className="text-xl text-bosque-600" />
              <h2 className="text-lg font-display font-bold text-madera-900">Préstamos por Categoría</h2>
            </div>
            <BarChart data={categories} maxVal={maxCat} labelKey="_id" valueKey="totalPrestamos" />
          </Card>
        ) : null}

        {/* Latest books */}
        {loading ? (
          <Card><SkeletonBarChart bars={5} /></Card>
        ) : latestBooks.length > 0 ? (
          <Card>
            <div className="flex items-center gap-2 mb-5">
              <MdBook className="text-xl text-bosque-600" />
              <h2 className="text-lg font-display font-bold text-madera-900">Últimos Libros Agregados</h2>
            </div>
            <div className="space-y-3">
              {latestBooks.map((libro, i) => (
                <div key={i} className="flex items-start gap-3 pb-3 border-b border-madera-200 last:border-0">
                  <div className="w-2 h-2 rounded-full bg-bosque-500 mt-2 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-madera-700">{libro.titulo}</p>
                    <p className="text-xs text-madera-400 mt-0.5">{libro.autor} — {libro.categoria} ({libro.anio})</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ) : null}
      </div>

      {/* Recommendations */}
      <Card>
        <div className="flex items-center gap-2 mb-5">
          <MdAutoAwesome className="text-xl text-bosque-600" />
          <h2 className="text-lg font-display font-bold text-madera-900">Recomendaciones</h2>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-bosque-700 text-white shadow-warm-sm"
                  : "bg-madera-200 text-madera-600 hover:bg-madera-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {recommendations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((rec, i) => (
              <div
                key={i}
                className="border-2 border-madera-200 rounded-xl p-4 hover:border-bosque-300 hover:shadow-warm-sm transition-all"
              >
                <h3 className="font-semibold text-madera-900">{rec.titulo}</h3>
                <p className="text-sm text-madera-500 mt-1">{rec.autor}</p>
                <div className="flex items-center gap-3 mt-3 text-xs text-madera-400">
                  <span>{rec.categoria}</span>
                  <span>{rec.anio}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-madera-400 text-sm">No hay recomendaciones disponibles para esta categoría.</p>
        )}
      </Card>
    </div>
  )
}
