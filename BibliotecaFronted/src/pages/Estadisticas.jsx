import { useState, useEffect } from "react"
import { MdBarChart, MdCategory, MdAutoAwesome, MdSummarize, MdRefresh } from "react-icons/md"
import Card from "../components/Card"
import Button from "../components/Button"
import { SkeletonCard, SkeletonBarChart } from "../components/Skeleton"
import { statsApi, recommendationsApi } from "../services/api"

function BarChart({ data, maxVal }) {
  return (
    <div className="space-y-3">
      {data.map((item, i) => (
        <div key={i} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-madera-700 font-medium">{item.categoria || item.libroId?.titulo || item.titulo || item._id}</span>
            <span className="text-madera-500 font-semibold">{item.totalPrestamos}</span>
          </div>
          <div className="w-full h-3 bg-madera-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-bosque-600 to-bosque-500 rounded-full transition-all duration-700"
              style={{ width: `${(item.totalPrestamos / maxVal) * 100}%` }}
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
  const [topBooks, setTopBooks] = useState([])
  const [categories, setCategories] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [recLoading, setRecLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [topRes, catsRes] = await Promise.all([
        statsApi.getTopBooks(10),
        statsApi.getStatisticsByCategory(),
      ])
      setTopBooks(topRes.data || [])
      setCategories(catsRes.data || [])
    } catch {
      setTopBooks([])
      setCategories([])
    }
    setLoading(false)
  }

  const fetchRecommendations = async () => {
    setRecLoading(true)
    try {
      await recommendationsApi.generate()
      const res = await recommendationsApi.getMy()
      const recData = res.data
      setRecommendations(recData?.librosSugeridos || [])
    } catch {
      setRecommendations([])
    }
    setRecLoading(false)
  }

  useEffect(() => { fetchData(); fetchRecommendations() }, [])

  const maxCat = categories.length > 0 ? Math.max(...categories.map(c => c.totalPrestamos)) : 1
  const maxTop = topBooks.length > 0 ? Math.max(...topBooks.map(l => l.totalPrestamos)) : 1

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-madera-900">Estadísticas y Recomendaciones</h1>
          <p className="text-madera-500 mt-1">Información general de la biblioteca</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" icon={MdRefresh} onClick={() => { fetchData(); fetchRecommendations() }}>
            Actualizar
          </Button>
        </div>
      </div>

      {/* Summary stats */}
      {!loading && (
        <Card>
          <div className="flex items-center gap-2 mb-5">
            <MdSummarize className="text-xl text-bosque-600" />
            <h2 className="text-lg font-display font-bold text-madera-900">Resumen</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <StatMini label="Libros en catálogo" value={topBooks.length} color="madera" />
            <StatMini label="Categorías" value={categories.length} color="verde" />
            <StatMini label="Total préstamos" value={categories.reduce((a, c) => a + c.totalPrestamos, 0)} color="oro" />
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most borrowed */}
        {loading ? (
          <Card><SkeletonBarChart bars={5} /></Card>
        ) : (
          <Card>
            <div className="flex items-center gap-2 mb-5">
              <MdBarChart className="text-xl text-bosque-600" />
              <h2 className="text-lg font-display font-bold text-madera-900">Libros Más Prestados</h2>
            </div>
            {topBooks.length > 0 ? (
              <BarChart data={topBooks} maxVal={maxTop} />
            ) : (
              <p className="text-madera-400 text-sm">No hay datos de préstamos aún.</p>
            )}
          </Card>
        )}

        {/* Categories */}
        {loading ? (
          <Card><SkeletonBarChart bars={5} /></Card>
        ) : (
          <Card>
            <div className="flex items-center gap-2 mb-5">
              <MdCategory className="text-xl text-bosque-600" />
              <h2 className="text-lg font-display font-bold text-madera-900">Préstamos por Categoría</h2>
            </div>
            {categories.length > 0 ? (
              <BarChart data={categories.map(c => ({ ...c, titulo: c._id }))} maxVal={maxCat} />
            ) : (
              <p className="text-madera-400 text-sm">No hay datos de categorías aún.</p>
            )}
          </Card>
        )}
      </div>

      {/* Recommendations */}
      <Card>
        <div className="flex items-center gap-2 mb-5">
          <MdAutoAwesome className="text-xl text-bosque-600" />
          <h2 className="text-lg font-display font-bold text-madera-900">Recomendaciones</h2>
        </div>

        {recLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin w-6 h-6 border-2 border-bosque-600 border-t-transparent rounded-full" />
          </div>
        ) : recommendations.length > 0 ? (
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
          <p className="text-madera-400 text-sm">No hay recomendaciones disponibles. Se generarán automáticamente al registrar préstamos.</p>
        )}
      </Card>
    </div>
  )
}
