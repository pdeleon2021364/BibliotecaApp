const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3006/biblioteca/v1"

function getToken() {
  return localStorage.getItem("token")
}

async function request(url, path, options = {}) {
  const token = getToken()
  const headers = { "Content-Type": "application/json", ...options.headers }
  if (token) headers["Authorization"] = `Bearer ${token}`

  const res = await fetch(`${url}${path}`, { ...options, headers })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message || body.error || `Error ${res.status}`)
  }
  return res.json()
}

export const authApi = {
  login: (data) => request(API_URL, "/auth/login", { method: "POST", body: JSON.stringify(data) }),
  register: (data) => request(API_URL, "/auth/register", { method: "POST", body: JSON.stringify(data) }),
}

export const booksApi = {
  getAll: (search) => request(API_URL, `/books${search ? `?search=${encodeURIComponent(search)}` : ""}`),
  getById: (id) => request(API_URL, `/books/${id}`),
  create: (data) => request(API_URL, "/books", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(API_URL, `/books/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => request(API_URL, `/books/${id}`, { method: "DELETE" }),
}

export const loansApi = {
  create: (data) => request(API_URL, "/loans", { method: "POST", body: JSON.stringify(data) }),
  returnBook: (data) => request(API_URL, "/returns", { method: "POST", body: JSON.stringify(data) }),
}

export const statsApi = {
  getStatistics: () => request(API_URL, "/statistics"),
  getStatisticsByCategory: () => request(API_URL, "/statistics/categories"),
  getRecommendations: (category) => request(API_URL, `/recommendations/${encodeURIComponent(category)}`),
  getSummary: () => request(API_URL, "/summary"),
}
