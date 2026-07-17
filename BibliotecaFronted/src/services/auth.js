import { authApi } from "./api"

export function login(data) {
  return authApi.login(data)
}

export function register(data) {
  return authApi.register(data)
}

export function saveTokens(token) {
  localStorage.setItem("accessToken", token)
}

export function getAccessToken() {
  return localStorage.getItem("accessToken")
}

export function logout() {
  localStorage.removeItem("accessToken")
}

export function isAuthenticated() {
  return !!getAccessToken()
}
