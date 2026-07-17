import { useState, useEffect } from "react"
import { MdAdd, MdAssignmentReturn } from "react-icons/md"
import Button from "../components/Button"
import Card from "../components/Card"
import SearchBar from "../components/SearchBar"
import Table from "../components/Table"
import Badge from "../components/Badge"
import Modal from "../components/Modal"
import { SkeletonTable } from "../components/Skeleton"
import { useToast } from "../components/Toast"
import { getAllLoans, createLoan, returnBook } from "../services/loans"
import { getBooks } from "../services/books"

export default function Prestamos() {
  const [search, setSearch] = useState("")
  const [prestamos, setPrestamos] = useState([])
  const [libros, setLibros] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ libroId: "", fechaDevolucionEstimada: "" })
  const [formErrors, setFormErrors] = useState({})
  const toast = useToast()

  const loadData = async () => {
    setLoading(true)
    try {
      const [loansRes, booksRes] = await Promise.all([
        getAllLoans({ limit: 50 }),
        getBooks({ limit: 100, disponible: "true" }),
      ])
      setPrestamos(loansRes.data || [])
      setLibros(booksRes.data || [])
    } catch (err) {
      toast(err.message || "Error al cargar datos", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const validateForm = () => {
    const errs = {}
    if (!form.libroId) errs.libroId = "Selecciona un libro"
    if (!form.fechaDevolucionEstimada) errs.fechaDevolucionEstimada = "Obligatorio"
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  const filteredPrestamos = prestamos.filter((p) => {
    const titulo = p.libroId?.titulo || ""
    const usuario = p.usuarioId?.nombre || p.usuarioId?.username || ""
    const estado = p.estado || ""
    return (
      titulo.toLowerCase().includes(search.toLowerCase()) ||
      usuario.toLowerCase().includes(search.toLowerCase()) ||
      estado.toLowerCase().includes(search.toLowerCase())
    )
  })

  const handleDevolver = async (id) => {
    try {
      await returnBook({ prestamoId: id })
      toast("Devolución registrada correctamente", "success")
      await loadData()
    } catch (err) {
      toast(err.message || "Error al devolver", "error")
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setSaving(true)
    try {
      await createLoan({ libroId: form.libroId, fechaDevolucionEstimada: form.fechaDevolucionEstimada })
      toast("Préstamo registrado correctamente", "success")
      await loadData()
      setModalOpen(false)
      setForm({ libroId: "", fechaDevolucionEstimada: "" })
      setFormErrors({})
    } catch (err) {
      toast(err.message || "Error al crear préstamo", "error")
    } finally {
      setSaving(false)
    }
  }

  const fieldClass = (field) =>
    `w-full px-4 py-2.5 rounded-lg border-2 bg-white text-madera-800 focus:outline-none focus:ring-2 transition-all text-sm ${
      formErrors[field] ? "border-peligro-600 focus:border-peligro-600 focus:ring-peligro-100" : "border-madera-300 focus:border-bosque-500 focus:ring-bosque-100"
    }`

  const badgeVariant = (estado) => {
    switch (estado) {
      case "activo": return "warning"
      case "devuelto": return "success"
      case "vencido": return "danger"
      default: return "info"
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return "-"
    return new Date(dateStr).toLocaleDateString("es-GT")
  }

  const columns = [
    {
      key: "libroId",
      label: "Libro",
      render: (val) => val?.titulo || "Libro eliminado",
    },
    {
      key: "usuarioId",
      label: "Usuario",
      render: (val) => val?.nombre || val?.username || "N/A",
    },
    {
      key: "fechaPrestamo",
      label: "Fecha Préstamo",
      render: (val) => formatDate(val),
    },
    {
      key: "fechaDevolucionEstimada",
      label: "Devolución Estimada",
      render: (val) => formatDate(val),
    },
    {
      key: "estado",
      label: "Estado",
      render: (val) => (
        <Badge variant={badgeVariant(val)}>
          {val?.charAt(0).toUpperCase() + val?.slice(1)}
        </Badge>
      ),
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          {row.estado === "activo" && (
            <button
              onClick={() => handleDevolver(row._id || row.id)}
              className="p-1.5 rounded-lg hover:bg-bosque-100 text-bosque-700 transition-colors cursor-pointer"
              title="Devolver"
            >
              <MdAssignmentReturn className="text-lg" />
            </button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-madera-900">Gestión de Préstamos</h1>
        <p className="text-madera-500 mt-1">Administra los préstamos de libros</p>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="w-full sm:w-80">
          <SearchBar value={search} onChange={setSearch} placeholder="Buscar por libro, usuario o estado..." />
        </div>
        <Button variant="accent" icon={MdAdd} onClick={() => setModalOpen(true)}>
          Nuevo Préstamo
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        {loading ? <div className="p-6"><SkeletonTable rows={5} cols={5} /></div> : <Table columns={columns} data={filteredPrestamos} />}
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Nuevo Préstamo">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-madera-700 mb-1">Libro</label>
            <select value={form.libroId} onChange={(e) => setForm({ ...form, libroId: e.target.value })} className={fieldClass("libroId")}>
              <option value="">Seleccionar libro...</option>
              {libros.map((l) => (
                <option key={l._id || l.id} value={l._id || l.id}>{l.titulo}</option>
              ))}
            </select>
            {formErrors.libroId && <p className="text-xs text-peligro-600 mt-1">{formErrors.libroId}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-madera-700 mb-1">Fecha de Devolución Estimada</label>
            <input type="date" value={form.fechaDevolucionEstimada} onChange={(e) => setForm({ ...form, fechaDevolucionEstimada: e.target.value })} className={fieldClass("fechaDevolucionEstimada")} />
            {formErrors.fechaDevolucionEstimada && <p className="text-xs text-peligro-600 mt-1">{formErrors.fechaDevolucionEstimada}</p>}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)} type="button">Cancelar</Button>
            <Button variant="accent" type="submit" disabled={saving}>
              {saving ? "Creando..." : "Crear Préstamo"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
