import { get, post } from "./APICalls";

export async function getCurrentSubscription() {
  return get("/subscriptions/current");
}

export async function getSubscriptionHistory() {
  return get("/subscriptions/history");
}

export async function subscribeToPlan(payload) {
  return post("/subscriptions", payload);
}