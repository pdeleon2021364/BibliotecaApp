import { useState, useEffect } from "react"
import { MdAdd, MdEdit, MdDelete } from "react-icons/md"
import Button from "../components/Button"
import Card from "../components/Card"
import SearchBar from "../components/SearchBar"
import Table from "../components/Table"
import Badge from "../components/Badge"
import Modal from "../components/Modal"
import ConfirmDialog from "../components/ConfirmDialog"
import { SkeletonTable } from "../components/Skeleton"
import { useToast } from "../components/Toast"
import { getBooks, createBook, updateBook, deleteBook } from "../services/books"
import { libros as mockLibros } from "../data/mockData"

const categorias = ["Novela", "Clásico", "Fábula", "Cuento"]

export default function Libros() {
  const [search, setSearch] = useState("")
  const [libros, setLibros] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [editingLibro, setEditingLibro] = useState(null)
  const [form, setForm] = useState({ titulo: "", autor: "", categoria: "", isbn: "", year: "" })
  const [formErrors, setFormErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const toast = useToast()

  const fetchBooks = async () => {
    setLoading(true)
    try {
      const data = await getBooks(search)
      setLibros(Array.isArray(data) ? data : data.libros || [])
    } catch {
      setLibros(mockLibros)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBooks() }, [search])

  const validateForm = () => {
    const errs = {}
    if (!form.titulo.trim()) errs.titulo = "Obligatorio"
    if (!form.autor.trim()) errs.autor = "Obligatorio"
    if (!form.categoria) errs.categoria = "Obligatorio"
    if (!form.year || Number(form.year) < 1000 || Number(form.year) > 2030) errs.year = "Año inválido"
    if (!form.isbn.trim()) errs.isbn = "Obligatorio"
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  const openCreate = () => {
    setEditingLibro(null)
    setForm({ titulo: "", autor: "", categoria: "", isbn: "", year: "" })
    setFormErrors({})
    setModalOpen(true)
  }

  const openEdit = (libro) => {
    setEditingLibro(libro)
    setForm({ titulo: libro.titulo, autor: libro.autor, categoria: libro.categoria, isbn: libro.isbn, year: String(libro.year) })
    setFormErrors({})
    setModalOpen(true)
  }

  const confirmDelete = (id) => {
    setDeleteId(id)
    setConfirmOpen(true)
  }

  const handleDelete = async () => {
    try {
      await deleteBook(deleteId)
      setLibros(libros.filter((l) => l.id !== deleteId))
      toast("Libro eliminado correctamente", "success")
    } catch {
      setLibros(libros.filter((l) => l.id !== deleteId))
      toast("Libro eliminado (modo demo)", "info")
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setSaving(true)
    try {
      if (editingLibro) {
        await updateBook(editingLibro.id, { ...form, year: Number(form.year) })
        setLibros(libros.map((l) => l.id === editingLibro.id ? { ...l, ...form, year: Number(form.year) } : l))
        toast("Libro actualizado correctamente", "success")
      } else {
        const created = await createBook({ ...form, year: Number(form.year) })
        const newLibro = created || { id: Date.now(), ...form, year: Number(form.year), estado: "disponible" }
        setLibros([...libros, newLibro])
        toast("Libro agregado correctamente", "success")
      }
      setModalOpen(false)
    } catch {
      if (editingLibro) {
        setLibros(libros.map((l) => l.id === editingLibro.id ? { ...l, ...form, year: Number(form.year) } : l))
      } else {
        setLibros([...libros, { id: Date.now(), ...form, year: Number(form.year), estado: "disponible" }])
      }
      toast(editingLibro ? "Actualizado (modo demo)" : "Agregado (modo demo)", "info")
      setModalOpen(false)
    } finally {
      setSaving(false)
    }
  }

  const fieldClass = (field) =>
    `w-full px-4 py-2.5 rounded-lg border border-madera-200 bg-white text-madera-800 focus:outline-none focus:ring-2 transition-all text-sm ${
      formErrors[field] ? "border-peligro-600 focus:border-peligro-600 focus:ring-peligro-100" : "focus:border-madera-400 focus:ring-madera-200"
    }`

  const filteredLibros = libros.filter(
    (l) =>
      l.titulo?.toLowerCase().includes(search.toLowerCase()) ||
      l.autor?.toLowerCase().includes(search.toLowerCase()) ||
      l.categoria?.toLowerCase().includes(search.toLowerCase())
  )

  const columns = [
    { key: "titulo", label: "Título" },
    { key: "autor", label: "Autor" },
    { key: "categoria", label: "Categoría" },
    { key: "year", label: "Año" },
    {
      key: "estado",
      label: "Estado",
      render: (val) => (
        <Badge variant={val === "disponible" ? "success" : "warning"}>
          {val?.charAt(0).toUpperCase() + val?.slice(1)}
        </Badge>
      ),
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEdit(row)} className="p-1.5 rounded-lg hover:bg-sky-50 text-sky-500 transition-colors cursor-pointer" title="Editar">
            <MdEdit className="text-lg" />
          </button>
          <button onClick={() => confirmDelete(row.id)} className="p-1.5 rounded-lg hover:bg-peligro-100 text-peligro-600 transition-colors cursor-pointer" title="Eliminar">
            <MdDelete className="text-lg" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-madera-800">Gestión de Libros</h1>
        <p className="text-madera-500 mt-1 text-sm">Administra el catálogo de la biblioteca</p>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="w-full sm:w-80">
          <SearchBar value={search} onChange={setSearch} placeholder="Buscar por título, autor o categoría..." />
        </div>
        <Button variant="accent" icon={MdAdd} onClick={openCreate}>
          Agregar Libro
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        {loading ? <div className="p-6"><SkeletonTable rows={5} cols={5} /></div> : <Table columns={columns} data={filteredLibros} />}
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingLibro ? "Editar Libro" : "Agregar Libro"}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-madera-700 mb-1">Título</label>
            <input type="text" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} className={fieldClass("titulo")} />
            {formErrors.titulo && <p className="text-xs text-peligro-600 mt-1">{formErrors.titulo}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-madera-700 mb-1">Autor</label>
            <input type="text" value={form.autor} onChange={(e) => setForm({ ...form, autor: e.target.value })} className={fieldClass("autor")} />
            {formErrors.autor && <p className="text-xs text-peligro-600 mt-1">{formErrors.autor}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-madera-700 mb-1">Categoría</label>
              <select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} className={fieldClass("categoria")}>
                <option value="">Seleccionar...</option>
                {categorias.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              {formErrors.categoria && <p className="text-xs text-peligro-600 mt-1">{formErrors.categoria}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-madera-700 mb-1">Año</label>
              <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className={fieldClass("year")} />
              {formErrors.year && <p className="text-xs text-peligro-600 mt-1">{formErrors.year}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-madera-700 mb-1">ISBN</label>
            <input type="text" value={form.isbn} onChange={(e) => setForm({ ...form, isbn: e.target.value })} className={fieldClass("isbn")} />
            {formErrors.isbn && <p className="text-xs text-peligro-600 mt-1">{formErrors.isbn}</p>}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)} type="button">Cancelar</Button>
            <Button variant="accent" type="submit" disabled={saving}>
              {saving ? "Guardando..." : editingLibro ? "Guardar Cambios" : "Agregar"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Eliminar Libro"
        message="¿Estás seguro de que deseas eliminar este libro? Esta acción no se puede deshacer."
      />
    </div>
  )
}
