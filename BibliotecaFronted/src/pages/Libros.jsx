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

const categorias = ["Novela", "Clásico", "Fábula", "Cuento", "Poesía", "Ensayo"]

export default function Libros() {
  const [search, setSearch] = useState("")
  const [libros, setLibros] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [editingLibro, setEditingLibro] = useState(null)
  const [form, setForm] = useState({ titulo: "", autor: "", categoria: "", anio: "", stock: "1" })
  const [formErrors, setFormErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const toast = useToast()

  const fetchBooks = async () => {
    setLoading(true)
    try {
      const res = await getBooks({ limit: 50 })
      setLibros(res.data || [])
    } catch {
      setLibros([])
      toast("Error al cargar libros", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBooks() }, [])

  const validateForm = () => {
    const errs = {}
    if (!form.titulo.trim()) errs.titulo = "Obligatorio"
    if (!form.autor.trim()) errs.autor = "Obligatorio"
    if (!form.categoria) errs.categoria = "Obligatorio"
    if (!form.anio || Number(form.anio) < 1000 || Number(form.anio) > 2030) errs.anio = "Año inválido"
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  const openCreate = () => {
    setEditingLibro(null)
    setForm({ titulo: "", autor: "", categoria: "", anio: "", stock: "1" })
    setFormErrors({})
    setModalOpen(true)
  }

  const openEdit = (libro) => {
    setEditingLibro(libro)
    setForm({
      titulo: libro.titulo || "",
      autor: libro.autor || "",
      categoria: libro.categoria || "",
      anio: String(libro.anio || ""),
      stock: String(libro.stock || 1),
    })
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
      setLibros(libros.filter((l) => l._id !== deleteId && l.id !== deleteId))
      toast("Libro eliminado correctamente", "success")
    } catch (err) {
      toast(err.message || "Error al eliminar", "error")
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setSaving(true)
    try {
      const payload = { titulo: form.titulo, autor: form.autor, categoria: form.categoria, anio: Number(form.anio), stock: Number(form.stock) }
      if (editingLibro) {
        const res = await updateBook(editingLibro._id || editingLibro.id, payload)
        toast("Libro actualizado correctamente", "success")
      } else {
        const res = await createBook(payload)
        toast("Libro agregado correctamente", "success")
      }
      await fetchBooks()
      setModalOpen(false)
    } catch (err) {
      toast(err.message || "Error al guardar", "error")
    } finally {
      setSaving(false)
    }
  }

  const fieldClass = (field) =>
    `w-full px-4 py-2.5 rounded-lg border-2 bg-white text-madera-800 focus:outline-none focus:ring-2 transition-all text-sm ${
      formErrors[field] ? "border-peligro-600 focus:border-peligro-600 focus:ring-peligro-100" : "border-madera-300 focus:border-bosque-500 focus:ring-bosque-100"
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
    { key: "anio", label: "Año" },
    { key: "stock", label: "Stock" },
    {
      key: "disponible",
      label: "Estado",
      render: (val) => (
        <Badge variant={val !== false ? "success" : "warning"}>
          {val !== false ? "Disponible" : "No disponible"}
        </Badge>
      ),
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEdit(row)} className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors cursor-pointer" title="Editar">
            <MdEdit className="text-lg" />
          </button>
          <button onClick={() => confirmDelete(row._id || row.id)} className="p-1.5 rounded-lg hover:bg-peligro-100 text-peligro-600 transition-colors cursor-pointer" title="Eliminar">
            <MdDelete className="text-lg" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-madera-900">Gestión de Libros</h1>
        <p className="text-madera-500 mt-1">Administra el catálogo de la biblioteca</p>
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
          <div className="grid grid-cols-3 gap-4">
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
              <input type="number" value={form.anio} onChange={(e) => setForm({ ...form, anio: e.target.value })} className={fieldClass("anio")} />
              {formErrors.anio && <p className="text-xs text-peligro-600 mt-1">{formErrors.anio}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-madera-700 mb-1">Stock</label>
              <input type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className={fieldClass("stock")} />
            </div>
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
