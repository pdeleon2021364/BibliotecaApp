import { authApi } from "./api"

export function login(data) {
  return authApi.login(data)
}

export function register(formData) {
  return authApi.register(formData)
}

export function saveTokens(accessToken, refreshToken) {
  localStorage.setItem("accessToken", accessToken)
  localStorage.setItem("refreshToken", refreshToken)
}

export function getAccessToken() {
  return localStorage.getItem("accessToken")
}

export function getRefreshToken() {
  return localStorage.getItem("refreshToken")
}

export function logout() {
  const refreshToken = getRefreshToken()
  localStorage.removeItem("accessToken")
  localStorage.removeItem("refreshToken")
  if (refreshToken) {
    authApi.logout(refreshToken).catch(() => {})
  }
}

export function isAuthenticated() {
  return !!getAccessToken()
}
