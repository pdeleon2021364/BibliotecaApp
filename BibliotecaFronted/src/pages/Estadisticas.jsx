import { useState, useEffect } from "react"
import { MdBarChart, MdCategory, MdAutoAwesome, MdRefresh, MdTrendingUp, MdMenuBook, MdPeople, MdAssignmentReturn, MdStar, MdLocalLibrary, MdSearch } from "react-icons/md"
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
        <div key={i} className="group">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-madera-700 group-hover:text-madera-800 transition-colors">
              {item.categoria || item.titulo}
            </span>
            <span className="text-xs font-semibold text-madera-600">
              {item.totalPrestamos}
            </span>
          </div>
          <div className="w-full h-3 bg-madera-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-madera-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${(item.totalPrestamos / maxVal) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function SummaryStat({ label, value, icon: Icon }) {
  return (
    <div className="bg-white border border-madera-200 rounded-xl p-4 hover:shadow-warm-sm transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-bosque-100 text-bosque-700">
          <Icon className="text-xl" />
        </div>
        <div>
          <p className="text-xs text-madera-500 font-medium uppercase tracking-wider">{label}</p>
          <p className="text-xl font-bold text-madera-800">{value}</p>
        </div>
      </div>
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
          <h1 className="text-2xl font-display font-bold text-madera-800">Estadísticas y Recomendaciones</h1>
          <p className="text-madera-500 mt-1 text-sm">Información general de la biblioteca</p>
        </div>
        <div className="flex items-center gap-3">
          {useMock && (
            <span className="text-xs bg-madera-100 text-madera-600 px-3 py-1 rounded-full font-medium">
              Datos de demostración
            </span>
          )}
          <Button variant="ghost" icon={MdRefresh} onClick={fetchData}>
            Actualizar
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryStat label="Total Libros" value={summary.totalLibros} icon={MdMenuBook} />
          <SummaryStat label="Disponibles" value={summary.librosDisponibles} icon={MdLocalLibrary} />
          <SummaryStat label="Prestados" value={summary.librosPrestados} icon={MdAssignmentReturn} />
          <SummaryStat label="Vencidos" value={summary.librosVencidos} icon={MdBarChart} />
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : summary && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <SummaryStat label="Usuarios" value={summary.totalUsuarios} icon={MdPeople} />
          <SummaryStat label="Préstamos Mes" value={summary.prestamosMes} icon={MdTrendingUp} />
          <SummaryStat label="Devueltos Hoy" value={summary.devueltosHoy} icon={MdAssignmentReturn} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <Card><SkeletonBarChart bars={5} /></Card>
        ) : statistics && (
          <Card>
            <div className="flex items-center gap-2 mb-5">
              <MdBarChart className="text-lg text-amber-500" />
              <h2 className="text-sm font-semibold text-madera-800 uppercase tracking-wider">Libros Más Prestados</h2>
            </div>
            <BarChart
              data={statistics.librosMasPrestados}
              maxVal={Math.max(...statistics.librosMasPrestados.map(l => l.totalPrestamos))}
            />
          </Card>
        )}

        {loading ? (
          <Card><SkeletonBarChart bars={5} /></Card>
        ) : categories && (
          <Card>
            <div className="flex items-center gap-2 mb-5">
              <MdCategory className="text-lg text-emerald-500" />
              <h2 className="text-sm font-semibold text-madera-800 uppercase tracking-wider">Préstamos por Categoría</h2>
            </div>
            <BarChart data={categories} maxVal={maxCat} />
          </Card>
        )}
      </div>

      <Card>
        <div className="flex items-center gap-2 mb-5">
          <MdAutoAwesome className="text-lg text-violet-500" />
          <h2 className="text-sm font-semibold text-madera-800 uppercase tracking-wider">Recomendaciones</h2>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-madera-800 text-white"
                  : "bg-madera-100 text-madera-600 hover:bg-madera-200"
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
                className="border border-madera-200 rounded-xl p-4 hover:border-madera-300 hover:shadow-warm-sm transition-all duration-300 bg-white"
              >
                <div className="flex items-center gap-2 mb-3">
                  <MdStar className="text-amber-400 text-sm" />
                </div>
                <h3 className="font-semibold text-madera-800 leading-tight">{rec.titulo}</h3>
                <p className="text-sm text-madera-500 mt-1">{rec.autor}</p>
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-madera-100">
                  <span className="text-xs text-madera-400">{rec.isbn}</span>
                  <span className="text-xs text-madera-400">{rec.year}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MdSearch className="text-4xl text-madera-300 mx-auto mb-3" />
            <p className="text-madera-400 text-sm">No hay recomendaciones disponibles para esta categoría.</p>
          </div>
        )}
      </Card>
    </div>
  )
}
