import { useEffect, useState } from "react";
import {
  getCurrentSubscription,
  getSubscriptionHistory,
  subscribeToPlan,
} from "../Services/subscriptionService";
import { getPlans } from "../Services/planService";

export function useSubscription() {
  const [subscription, setSubscription] = useState(null);
  const [history, setHistory] = useState([]);
  const [plan, setPlan] = useState(null);
  const [plans, setPlans] = useState([]);

  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchAll() {
    setLoading(true);
    setError(null);

    try {
      const [currentResult, historyResult, plansResult] = await Promise.all([
        getCurrentSubscription(),
        getSubscriptionHistory(),
        getPlans(),
      ]);

      const currentSubscription =
        currentResult?.data?.subscription || null;

      setSubscription(currentSubscription);
      setPlan(currentSubscription?.plan || null);
      setHistory(historyResult?.data?.subscriptions || []);
      setPlans(plansResult?.data?.plans || []);
    } catch (err) {
      setError(err.message || "Failed to load subscription data.");
    } finally {
      setLoading(false);
    }
  }

  async function upgradeToPlan(planName) {
    setUpgrading(true);
    setError(null);

    try {
      const result = await subscribeToPlan({
        plan_name: planName,
      });

      await fetchAll();

      return result;
    } catch (err) {
      setError(err.message || "Failed to update subscription.");
      throw err;
    } finally {
      setUpgrading(false);
    }
  }

  function daysRemaining() {
    if (!subscription?.end_date) return null;

    const end = new Date(subscription.end_date);
    const now = new Date();
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));

    return diff > 0 ? diff : 0;
  }

  function renewalDate() {
    if (!subscription?.end_date) return null;

    return new Date(subscription.end_date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  useEffect(() => {
    fetchAll();
  }, []);

  return {
    subscription,
    history,
    plan,
    plans,
    loading,
    upgrading,
    error,
    daysRemaining,
    renewalDate,
    refetch: fetchAll,
    upgradeToPlan,
  };
}