import { get } from "./apiClient";

export async function getPlans() {
  return get("/plans");
}

export async function getPlanById(id) {
  return get(`/plans/${id}`);
}