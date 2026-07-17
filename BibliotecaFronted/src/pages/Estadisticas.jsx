import { useState, useEffect } from "react"
import { MdBarChart, MdCategory, MdAutoAwesome, MdSummarize, MdRefresh } from "react-icons/md"
import Card from "../components/Card"
import Button from "../components/Button"
import { SkeletonCard, SkeletonBarChart } from "../components/Skeleton"
import { statsApi } from "../services/api"
import { mockStatistics, mockCategories, mockSummary } from "../services/mockEstadisticas"

const categorias = ["Novela", "Clásico", "Cuento", "Fábula", "Poesía", "Ensayo"]

function BarChart({ data, maxVal }) {
  return (
    <div className="space-y-3">
      {data.map((item, i) => (
        <div key={i} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-madera-700 font-medium">{item.categoria || item.titulo}</span>
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
  const [statistics, setStatistics] = useState(null)
  const [categories, setCategories] = useState(null)
  const [summary, setSummary] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("Novela")
  const [loading, setLoading] = useState(true)
  const [useMock, setUseMock] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [stats, cats, sum] = await Promise.all([
        statsApi.getStatistics(),
        statsApi.getStatisticsByCategory(),
        statsApi.getSummary(),
      ])
      setStatistics(stats)
      setCategories(cats)
      setSummary(sum)
      setUseMock(false)
    } catch {
      setStatistics(mockStatistics)
      setCategories(mockCategories)
      setSummary(mockSummary)
      setUseMock(true)
    }
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  useEffect(() => {
    if (!useMock) {
      statsApi.getRecommendations(selectedCategory)
        .then(setRecommendations)
        .catch(() => setRecommendations([]))
    } else {
      setRecommendations([
        { titulo: "La Casa de los Espíritus", autor: "Isabel Allende", isbn: "978-0-06-112041-1", year: 1982 },
        { titulo: "Crónica de una Muerte Anunciada", autor: "Gabriel García Márquez", isbn: "978-0-06-088328-8", year: 1981 },
        { titulo: "El Amor en los Tiempos del Cólera", autor: "Gabriel García Márquez", isbn: "978-0-307-38929-4", year: 1985 },
      ])
    }
  }, [selectedCategory, useMock])

  const maxCat = categories ? Math.max(...categories.map(c => c.totalPrestamos)) : 1

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-madera-900">Estadísticas y Recomendaciones</h1>
          <p className="text-madera-500 mt-1">Información general de la biblioteca</p>
        </div>
        <div className="flex items-center gap-3">
          {useMock && (
            <span className="text-xs bg-peligro-100 text-peligro-600 px-3 py-1 rounded-full font-medium">
              Datos de demostración
            </span>
          )}
          <Button variant="ghost" icon={MdRefresh} onClick={fetchData}>
            Actualizar
          </Button>
        </div>
      </div>

      {/* Summary */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : summary && (
        <Card>
          <div className="flex items-center gap-2 mb-5">
            <MdSummarize className="text-xl text-bosque-600" />
            <h2 className="text-lg font-display font-bold text-madera-900">Resumen General</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatMini label="Total Libros" value={summary.totalLibros} color="madera" />
            <StatMini label="Disponibles" value={summary.librosDisponibles} color="verde" />
            <StatMini label="Prestados" value={summary.librosPrestados} color="oro" />
            <StatMini label="Vencidos" value={summary.librosVencidos} color="peligro" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
            <StatMini label="Usuarios" value={summary.totalUsuarios} color="madera" />
            <StatMini label="Préstamos este mes" value={summary.prestamosMes} color="verde" />
            <StatMini label="Devueltos hoy" value={summary.devueltosHoy} color="verde" />
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most borrowed */}
        {loading ? (
          <Card><SkeletonBarChart bars={5} /></Card>
        ) : statistics && (
          <Card>
            <div className="flex items-center gap-2 mb-5">
              <MdBarChart className="text-xl text-bosque-600" />
              <h2 className="text-lg font-display font-bold text-madera-900">Libros Más Prestados</h2>
            </div>
            <BarChart
              data={statistics.librosMasPrestados}
              maxVal={Math.max(...statistics.librosMasPrestados.map(l => l.totalPrestamos))}
            />
          </Card>
        )}

        {/* Categories */}
        {loading ? (
          <Card><SkeletonBarChart bars={5} /></Card>
        ) : categories && (
          <Card>
            <div className="flex items-center gap-2 mb-5">
              <MdCategory className="text-xl text-bosque-600" />
              <h2 className="text-lg font-display font-bold text-madera-900">Préstamos por Categoría</h2>
            </div>
            <BarChart data={categories} maxVal={maxCat} />
          </Card>
        )}
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
                  <span>ISBN: {rec.isbn}</span>
                  <span>{rec.year}</span>
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
