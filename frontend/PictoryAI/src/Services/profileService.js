import { patch } from "./APICalls.js";

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

export async function updatePassword(currentPassword, password, passwordConfirmation) {
  return patch("/profile/password", {
    current_password: currentPassword,
    password,
    password_confirmation: passwordConfirmation,
  });
}