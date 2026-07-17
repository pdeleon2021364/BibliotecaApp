export const libros = [
  { id: 1, titulo: "Cien Años de Soledad", autor: "Gabriel García Márquez", categoria: "Novela", estado: "disponible", isbn: "978-0-06-088328-7", year: 1967 },
  { id: 2, titulo: "Don Quijote de la Mancha", autor: "Miguel de Cervantes", categoria: "Clásico", estado: "prestado", isbn: "978-84-376-0494-7", year: 1605 },
  { id: 3, titulo: "La Sombra del Viento", autor: "Carlos Ruiz Zafón", categoria: "Novela", estado: "disponible", isbn: "978-84-08-16346-6", year: 2001 },
  { id: 4, titulo: "El Principito", autor: "Antoine de Saint-Exupéry", categoria: "Fábula", estado: "prestado", isbn: "978-0-15-601219-5", year: 1943 },
  { id: 5, titulo: "Rayuela", autor: "Julio Cortázar", categoria: "Novela", estado: "disponible", isbn: "978-84-376-0603-0", year: 1963 },
  { id: 6, titulo: "Ficciones", autor: "Jorge Luis Borges", categoria: "Cuento", estado: "disponible", isbn: "978-0-8021-3030-3", year: 1944 },
  { id: 7, titulo: "Pedro Páramo", autor: "Juan Rulfo", categoria: "Novela", estado: "prestado", isbn: "978-84-376-0494-8", year: 1955 },
  { id: 8, titulo: "El Aleph", autor: "Jorge Luis Borges", categoria: "Cuento", estado: "disponible", isbn: "978-0-8021-3031-0", year: 1949 },
]

export const prestamos = [
  { id: 1, libro: "Don Quijote de la Mancha", usuario: "María López", fechaPrestamo: "2026-07-01", fechaDevolucion: "2026-07-15", estado: "devuelto" },
  { id: 2, libro: "El Principito", usuario: "Carlos Ramírez", fechaPrestamo: "2026-07-05", fechaDevolucion: "2026-07-19", estado: "activo" },
  { id: 3, libro: "Pedro Páramo", usuario: "Ana Torres", fechaPrestamo: "2026-06-28", fechaDevolucion: "2026-07-12", estado: "vencido" },
  { id: 4, libro: "Cien Años de Soledad", usuario: "Luis García", fechaPrestamo: "2026-07-10", fechaDevolucion: "2026-07-24", estado: "activo" },
  { id: 5, libro: "Ficciones", usuario: "Laura Martínez", fechaPrestamo: "2026-07-12", fechaDevolucion: "2026-07-26", estado: "activo" },
  { id: 6, libro: "Rayuela", usuario: "Pedro Sánchez", fechaPrestamo: "2026-06-20", fechaDevolucion: "2026-07-04", estado: "devuelto" },
]

export const stats = {
  totalLibros: 156,
  prestamosActivos: 23,
  devueltosHoy: 8,
  usuarios: 45,
}

export const actividadReciente = [
  { id: 1, texto: "María López devolvió 'Don Quijote de la Mancha'", tiempo: "Hace 2 horas" },
  { id: 2, texto: "Carlos Ramírez tomó prestado 'El Principito'", tiempo: "Hace 5 horas" },
  { id: 3, texto: "Nuevo libro registrado: 'La Casa de los Espíritus'", tiempo: "Ayer" },
  { id: 4, texto: "Ana Torres solicitó extensión de préstamo", tiempo: "Ayer" },
  { id: 5, texto: "Pedro Sánchez devolvió 'Rayuela'", tiempo: "Hace 3 días" },
]
