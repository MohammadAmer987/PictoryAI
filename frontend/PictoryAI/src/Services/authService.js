import { get, post } from "./APICalls";
import {
  setAccessToken,
  setAuthUser,
  clearAuthStorage,
} from "../utils/tokenStorage";

export async function register(payload) {
  return post("/register", payload);
}

export async function login(payload) {
  const data = await post("/login", payload);

  if (data?.data?.token) {
    setAccessToken(data.data.token);
  }

  if (data?.data?.user) {
    setAuthUser(data.data.user);
  }

  return data;
}

export async function logout() {
  try {
    await post("/logout");
  } finally {
    clearAuthStorage();
  }
}

export async function getMe() {
  return get("/me");
}