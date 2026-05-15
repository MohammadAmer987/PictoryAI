import { patch } from "./APICalls.js";

const API_BASE_URL = "http://127.0.0.1:8000/api";

function getToken() {
  return localStorage.getItem("access_token");
}

export async function updateProfileName(ownerName) {
  return patch("/profile/name", {
    owner_name: ownerName,
  });
}

export async function updateStoreName(storeName) {
  return patch("/profile/store-name", {
    store_name: storeName,
  });
}

export async function updateEmail(email) {
  return patch("/profile/email", {
    email,
  });
}

export async function updatePassword(
  currentPassword,
  password,
  passwordConfirmation
) {
  return patch("/profile/password", {
    current_password: currentPassword,
    password,
    password_confirmation: passwordConfirmation,
  });
}

export async function updateProfileLogo(file) {
  const token = getToken();

  if (!token) {
    throw new Error("You must be logged in to upload a photo.");
  }

  const formData = new FormData();
  formData.append("logo", file);

  const response = await fetch(`${API_BASE_URL}/profile/logo`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Failed to upload photo.");
  }

  return data;
}