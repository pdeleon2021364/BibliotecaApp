const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3006"
const BASE = "/biblioteca/v1"

function getToken() {
  return localStorage.getItem("accessToken")
}

async function request(path, options = {}) {
  const token = getToken()
  const headers = { ...options.headers }
  if (token) headers["Authorization"] = `Bearer ${token}`
  if (options.body && !options.isFormData) headers["Content-Type"] = "application/json"

  const res = await fetch(`${API_URL}${BASE}${path}`, { ...options, headers })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message || body.error || `Error ${res.status}`)
  }
  return res.json()
}

export const authApi = {
  login: (data) => request("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  register: (data) => request("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  logout: () => Promise.resolve(),
}

export const booksApi = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams()
    if (params.page) qs.set("page", params.page)
    if (params.limit) qs.set("limit", params.limit)
    if (params.categoria) qs.set("categoria", params.categoria)
    if (params.disponible !== undefined) qs.set("disponible", params.disponible)
    const query = qs.toString()
    return request(`/books${query ? `?${query}` : ""}`)
  },
  getById: (id) => request(`/books/${id}`),
  create: (data) => request("/books", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/books/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => request(`/books/${id}`, { method: "DELETE" }),
}

export const loansApi = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams()
    if (params.page) qs.set("page", params.page)
    if (params.limit) qs.set("limit", params.limit)
    if (params.estado) qs.set("estado", params.estado)
    const query = qs.toString()
    return request(`/loans${query ? `?${query}` : ""}`)
  },
  getMyLoans: (params = {}) => {
    const qs = new URLSearchParams()
    if (params.page) qs.set("page", params.page)
    if (params.limit) qs.set("limit", params.limit)
    if (params.estado) qs.set("estado", params.estado)
    const query = qs.toString()
    return request(`/loans/my-loans${query ? `?${query}` : ""}`)
  },
  getById: (id) => request(`/loans/${id}`),
  create: (data) => request("/loans", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/loans/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => request(`/loans/${id}`, { method: "DELETE" }),
}

export const returnsApi = {
  create: (data) => request("/returns", { method: "POST", body: JSON.stringify(data) }),
  getAll: (params = {}) => {
    const qs = new URLSearchParams()
    if (params.page) qs.set("page", params.page)
    if (params.limit) qs.set("limit", params.limit)
    const query = qs.toString()
    return request(`/returns${query ? `?${query}` : ""}`)
  },
}

export const statsApi = {
  getStatistics: (params = {}) => {
    const qs = new URLSearchParams()
    if (params.page) qs.set("page", params.page)
    if (params.limit) qs.set("limit", params.limit)
    const query = qs.toString()
    return request(`/statistics${query ? `?${query}` : ""}`)
  },
  getStatisticsByCategory: () => request("/statistics/by-category"),
  getTopBooks: (limit = 5) => request(`/statistics/top?limit=${limit}`),
}

export const recommendationsApi = {
  generate: () => request("/recommendations/generate", { method: "POST" }),
  getMy: () => request("/recommendations/my"),
}
