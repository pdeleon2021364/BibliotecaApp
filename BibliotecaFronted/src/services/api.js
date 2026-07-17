const AUTH_URL = import.meta.env.VITE_AUTH_URL || "http://localhost:5156"
const BOOKS_URL = import.meta.env.VITE_BOOKS_URL || "http://localhost:3001"
const STATS_URL = import.meta.env.VITE_STATS_URL || "http://localhost:3002"

function getToken() {
  return localStorage.getItem("accessToken")
}

async function request(url, path, options = {}) {
  const token = getToken()
  const headers = { ...options.headers }
  if (token) headers["Authorization"] = `Bearer ${token}`
  if (!options.isFormData) headers["Content-Type"] = "application/json"

  const res = await fetch(`${url}${path}`, { ...options, headers })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message || body.error || `Error ${res.status}`)
  }
  return res.json()
}

export const authApi = {
  login: (data) => request(AUTH_URL, "/api/v1/auth/login", { method: "POST", body: JSON.stringify(data) }),
  register: (formData) => request(AUTH_URL, "/api/v1/auth/register", { method: "POST", body: formData, isFormData: true }),
  logout: (refreshToken) => request(AUTH_URL, "/api/v1/auth/logout", { method: "POST", body: JSON.stringify({ refreshToken }) }),
}

export const booksApi = {
  getAll: (search) => request(BOOKS_URL, `/books${search ? `?search=${encodeURIComponent(search)}` : ""}`),
  getById: (id) => request(BOOKS_URL, `/books/${id}`),
  create: (data) => request(BOOKS_URL, "/books", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(BOOKS_URL, `/books/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => request(BOOKS_URL, `/books/${id}`, { method: "DELETE" }),
}

export const loansApi = {
  create: (data) => request(BOOKS_URL, "/loans", { method: "POST", body: JSON.stringify(data) }),
  returnBook: (data) => request(BOOKS_URL, "/returns", { method: "POST", body: JSON.stringify(data) }),
}

export const statsApi = {
  getStatistics: () => request(STATS_URL, "/statistics"),
  getStatisticsByCategory: () => request(STATS_URL, "/statistics/categories"),
  getRecommendations: (category) => request(STATS_URL, `/recommendations/${encodeURIComponent(category)}`),
  getSummary: () => request(STATS_URL, "/summary"),
}
