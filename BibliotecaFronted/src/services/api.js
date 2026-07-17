const AUTH_URL = import.meta.env.VITE_AUTH_URL || "http://localhost:3001/api/v1"
const BOOKS_URL = import.meta.env.VITE_BOOKS_URL || "http://localhost:3006/biblioteca/v1"
const STATS_URL = import.meta.env.VITE_STATS_URL || "http://localhost:3007/estadisticas/v1"

function getToken() {
  return localStorage.getItem("accessToken")
}

async function request(url, path, options = {}) {
  const token = getToken()
  const headers = { ...options.headers }
  if (token) headers["x-token"] = token
  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json"
  }

  const res = await fetch(`${url}${path}`, { ...options, headers })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.message || body.error || `Error ${res.status}`)
  return body
}

export const authApi = {
  login: (data) => request(AUTH_URL, "/auth/login", { method: "POST", body: JSON.stringify(data) }),
  register: (data) => {
    const fd = new FormData()
    fd.append("name", data.name)
    fd.append("surname", data.surname)
    fd.append("username", data.username)
    fd.append("email", data.email)
    fd.append("password", data.password)
    if (data.phone) fd.append("phone", data.phone)
    return request(AUTH_URL, "/auth/register", { method: "POST", body: fd })
  },
  logout: (refreshToken) => request(AUTH_URL, "/auth/logout", { method: "POST", body: JSON.stringify({ refreshToken }) }),
  getProfile: () => request(AUTH_URL, "/auth/profile"),
}

export const booksApi = {
  getAll: (params = {}) => {
    const q = new URLSearchParams()
    if (params.page) q.set("page", params.page)
    if (params.limit) q.set("limit", params.limit)
    if (params.categoria) q.set("categoria", params.categoria)
    if (params.disponible !== undefined) q.set("disponible", params.disponible)
    if (params.titulo) q.set("titulo", params.titulo)
    if (params.autor) q.set("autor", params.autor)
    const qs = q.toString()
    return request(BOOKS_URL, `/books${qs ? `?${qs}` : ""}`)
  },
  getById: (id) => request(BOOKS_URL, `/books/${id}`),
  create: (data) => request(BOOKS_URL, "/books", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(BOOKS_URL, `/books/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => request(BOOKS_URL, `/books/${id}`, { method: "DELETE" }),
}

export const loansApi = {
  getAll: (params = {}) => {
    const q = new URLSearchParams()
    if (params.page) q.set("page", params.page)
    if (params.limit) q.set("limit", params.limit)
    if (params.estado) q.set("estado", params.estado)
    const qs = q.toString()
    return request(BOOKS_URL, `/loans${qs ? `?${qs}` : ""}`)
  },
  getMyLoans: (params = {}) => {
    const q = new URLSearchParams()
    if (params.page) q.set("page", params.page)
    if (params.limit) q.set("limit", params.limit)
    if (params.estado) q.set("estado", params.estado)
    const qs = q.toString()
    return request(BOOKS_URL, `/loans/my-loans${qs ? `?${qs}` : ""}`)
  },
  create: (data) => request(BOOKS_URL, "/loans", { method: "POST", body: JSON.stringify(data) }),
  returnBook: (data) => request(BOOKS_URL, "/returns", { method: "POST", body: JSON.stringify(data) }),
}

export const statsApi = {
  getStatistics: () => request(STATS_URL, "/statistics"),
  getStatisticsByCategory: () => request(STATS_URL, "/statistics/categories"),
  getTopBooks: (limit = 5) => request(STATS_URL, `/statistics/top?limit=${limit}`),
  getRecommendations: (category) => request(STATS_URL, `/recommendations/category/${encodeURIComponent(category)}`),
  generateRecommendations: () => request(STATS_URL, "/recommendations/generate", { method: "POST" }),
  getMyRecommendations: () => request(STATS_URL, "/recommendations/my"),
  getSummary: () => request(STATS_URL, "/summary"),
  getLatest: (limit = 5) => request(STATS_URL, `/latest?limit=${limit}`),
}
