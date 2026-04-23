const ACCESS_TOKEN_KEY = "access_token";
const USER_KEY = "auth_user";

export function setAccessToken(token) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function removeAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function setAuthUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getAuthUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function removeAuthUser() {
  localStorage.removeItem(USER_KEY);
}

export function clearAuthStorage() {
  removeAccessToken();
  removeAuthUser();
}