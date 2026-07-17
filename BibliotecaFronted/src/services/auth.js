import { authApi } from "./api"

export function login(data) {
  return authApi.login(data)
}

export function register(data) {
  return authApi.register(data)
}

export function saveToken(token) {
  localStorage.setItem("token", token)
}

export function getToken() {
  return localStorage.getItem("token")
}

export function logout() {
  localStorage.removeItem("token")
}

export function isAuthenticated() {
  return !!getToken()
}
