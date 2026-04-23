import { get } from "./APICalls";

export async function getPlans() {
  return get("/plans");
}

export async function getPlanById(id) {
  return get(`/plans/${id}`);
}