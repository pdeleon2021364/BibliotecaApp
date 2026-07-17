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
import { createLoan, returnBook } from "../services/loans"
import { getBooks } from "../services/books"
import { prestamos as initialPrestamos, libros as mockLibros } from "../data/mockData"

export default function Prestamos() {
  const [search, setSearch] = useState("")
  const [prestamos, setPrestamos] = useState([])
  const [libros, setLibros] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ libro: "", usuario: "", fechaPrestamo: "", fechaDevolucion: "" })
  const [formErrors, setFormErrors] = useState({})
  const toast = useToast()

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const booksData = await getBooks()
        setLibros(Array.isArray(booksData) ? booksData : booksData.libros || [])
      } catch {
        setLibros(mockLibros)
      }
      setPrestamos(initialPrestamos)
      setLoading(false)
    }
    load()
  }, [])

  const validateForm = () => {
    const errs = {}
    if (!form.libro) errs.libro = "Selecciona un libro"
    if (!form.usuario.trim()) errs.usuario = "El nombre del usuario es obligatorio"
    if (!form.fechaPrestamo) errs.fechaPrestamo = "Obligatorio"
    if (!form.fechaDevolucion) errs.fechaDevolucion = "Obligatorio"
    else if (form.fechaPrestamo && form.fechaDevolucion <= form.fechaPrestamo) errs.fechaDevolucion = "Debe ser posterior al préstamo"
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  const filteredPrestamos = prestamos.filter(
    (p) =>
      p.libro?.toLowerCase().includes(search.toLowerCase()) ||
      p.usuario?.toLowerCase().includes(search.toLowerCase()) ||
      p.estado?.toLowerCase().includes(search.toLowerCase())
  )

  const handleDevolver = async (id) => {
    try {
      await returnBook({ prestamoId: id })
      setPrestamos(prestamos.map((p) => p.id === id ? { ...p, estado: "devuelto" } : p))
      toast("Devolución registrada correctamente", "success")
    } catch {
      setPrestamos(prestamos.map((p) => p.id === id ? { ...p, estado: "devuelto" } : p))
      toast("Devolución registrada (modo demo)", "info")
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setSaving(true)
    try {
      await createLoan(form)
      setPrestamos([...prestamos, { id: Date.now(), ...form, estado: "activo" }])
      toast("Préstamo registrado correctamente", "success")
    } catch {
      setPrestamos([...prestamos, { id: Date.now(), ...form, estado: "activo" }])
      toast("Préstamo registrado (modo demo)", "info")
    } finally {
      setSaving(false)
      setModalOpen(false)
      setForm({ libro: "", usuario: "", fechaPrestamo: "", fechaDevolucion: "" })
      setFormErrors({})
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

  const columns = [
    { key: "libro", label: "Libro" },
    { key: "usuario", label: "Usuario" },
    { key: "fechaPrestamo", label: "Fecha Préstamo" },
    { key: "fechaDevolucion", label: "Fecha Devolución" },
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
              onClick={() => handleDevolver(row.id)}
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
            <select value={form.libro} onChange={(e) => setForm({ ...form, libro: e.target.value })} className={fieldClass("libro")}>
              <option value="">Seleccionar libro...</option>
              {libros.filter((l) => l.estado === "disponible").map((l) => (
                <option key={l.id} value={l.titulo}>{l.titulo}</option>
              ))}
            </select>
            {formErrors.libro && <p className="text-xs text-peligro-600 mt-1">{formErrors.libro}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-madera-700 mb-1">Usuario</label>
            <input
              type="text"
              value={form.usuario}
              onChange={(e) => setForm({ ...form, usuario: e.target.value })}
              placeholder="Nombre del usuario"
              className={fieldClass("usuario")}
            />
            {formErrors.usuario && <p className="text-xs text-peligro-600 mt-1">{formErrors.usuario}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-madera-700 mb-1">Fecha Préstamo</label>
              <input type="date" value={form.fechaPrestamo} onChange={(e) => setForm({ ...form, fechaPrestamo: e.target.value })} className={fieldClass("fechaPrestamo")} />
              {formErrors.fechaPrestamo && <p className="text-xs text-peligro-600 mt-1">{formErrors.fechaPrestamo}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-madera-700 mb-1">Fecha Devolución</label>
              <input type="date" value={form.fechaDevolucion} onChange={(e) => setForm({ ...form, fechaDevolucion: e.target.value })} className={fieldClass("fechaDevolucion")} />
              {formErrors.fechaDevolucion && <p className="text-xs text-peligro-600 mt-1">{formErrors.fechaDevolucion}</p>}
            </div>
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
