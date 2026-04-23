import { useState } from "react";
import { useSubscription } from "./useSubscription";

const COLORS = {
  darkGreen: "#1e4d3d",
  midGreen: "#2d6a55",
  accent: "#10b981",
  lightBg: "#f0f7f4",
  cardGradient: "linear-gradient(135deg, #4a7c68 0%, #1e4d3d 100%)",
  muted: "#6b9e8a",
};

function StatusBadge({ status }) {
  const map = {
    active: { label: "Active", color: "#10b981", bg: "rgba(16,185,129,0.12)" },
    expired: { label: "Expired", color: "#f6a623", bg: "rgba(246,166,35,0.12)" },
    cancelled: { label: "Cancelled", color: "#e53e3e", bg: "rgba(229,62,62,0.12)" },
  };

  const s = map[status] || map.active;

  return (
    <span
      className="badge"
      style={{
        backgroundColor: s.bg,
        color: s.color,
        fontWeight: 700,
        fontSize: 11,
        padding: "4px 10px",
        borderRadius: 20,
      }}
    >
      {s.label}
    </span>
  );
}

function PlanCard({ plan, currentPlanName, onSelect, upgrading }) {
  const isCurrent = plan.name === currentPlanName;
  const isPro = plan.name === "pro";

  return (
    <div
      className="border rounded-3 p-3 mb-3"
      style={{
        borderColor: isCurrent ? COLORS.accent : COLORS.muted + "55",
        backgroundColor: isCurrent ? "rgba(16,185,129,0.08)" : "white",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-2">
        <span className="fw-bold" style={{ color: COLORS.darkGreen, fontSize: 16 }}>
          {plan.name.toUpperCase()}
        </span>

        <span className="fw-bold" style={{ color: COLORS.accent, fontSize: 18 }}>
          ${plan.price}
          <span style={{ fontSize: 12, color: COLORS.muted }}>/mo</span>
        </span>
      </div>

      <ul className="list-unstyled mb-3" style={{ fontSize: 13, color: "#4a7c68" }}>
        <li>✓ Max generations: {plan.max_generations ?? "Unlimited"}</li>
        <li>✓ Watermark: {plan.watermark ? "Enabled" : "Removed"}</li>
        <li>✓ {isPro ? "Premium access" : "Basic access"}</li>
      </ul>

      <button
        className="btn w-100 text-white fw-bold"
        style={{
          backgroundColor: isCurrent ? COLORS.muted : COLORS.darkGreen,
          borderRadius: 30,
          border: "none",
        }}
        disabled={isCurrent || upgrading}
        onClick={() => onSelect(plan)}
      >
        {isCurrent ? "Current Plan" : upgrading ? "Updating..." : `Switch to ${plan.name}`}
      </button>
    </div>
  );
}

export default function SubscriptionPage() {
  const {
    subscription,
    history,
    plan,
    plans,
    loading,
    upgrading,
    error,
    daysRemaining,
    renewalDate,
    upgradeToPlan,
  } = useSubscription();

  const [actionError, setActionError] = useState("");

  async function handleChangePlan(selectedPlan) {
    setActionError("");

    try {
      await upgradeToPlan(selectedPlan.name);
    } catch (err) {
      setActionError(err.message || "Failed to change plan.");
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 300 }}>
        <div className="spinner-border" style={{ color: COLORS.accent }} role="status" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="alert m-4"
        style={{
          backgroundColor: "#fee2e2",
          color: "#991b1b",
          border: "none",
          borderRadius: 12,
        }}
      >
        {error}
      </div>
    );
  }

  const days = daysRemaining();
  const renewal = renewalDate();

  return (
    <div style={{ backgroundColor: COLORS.lightBg, minHeight: "100vh", padding: "40px 16px" }}>
      <div className="container" style={{ maxWidth: 720 }}>
        <div className="mb-4">
          <h4 className="fw-bold mb-1" style={{ color: COLORS.darkGreen }}>
            My Subscription
          </h4>
          <p style={{ color: COLORS.muted, fontSize: 14, margin: 0 }}>
            Manage your current plan and subscription history
          </p>
        </div>

        <div
          className="card border-0 mb-4"
          style={{
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(30,77,61,0.12)",
          }}
        >
          <div style={{ background: COLORS.cardGradient, padding: "24px 28px" }}>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span style={{ fontSize: 22 }}>🌿</span>

                  <h5 className="m-0 text-white fw-bold" style={{ fontSize: 20 }}>
                    {plan?.name ? `${plan.name.toUpperCase()} Plan` : "No Active Plan"}
                  </h5>
                </div>

                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>
                  {plan
                    ? plan.price > 0
                      ? `$${plan.price} / month`
                      : "Free plan"
                    : "No subscription found"}
                </span>
              </div>

              <div className="text-end">
                {subscription && <StatusBadge status={subscription.status} />}
              </div>
            </div>

            {renewal ? (
              <div
                className="mt-3 d-flex align-items-center gap-3"
                style={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  padding: "10px 16px",
                }}
              >
                <div className="text-center">
                  <div className="fw-bold text-white" style={{ fontSize: 24, lineHeight: 1 }}>
                    {days ?? "--"}
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 11 }}>
                    days left
                  </div>
                </div>

                <div style={{ width: 1, height: 36, backgroundColor: "rgba(255,255,255,0.2)" }} />

                <div>
                  <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 11 }}>
                    Ends on
                  </div>
                  <div className="text-white fw-semibold" style={{ fontSize: 13 }}>
                    {renewal}
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="mt-3"
                style={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  padding: "10px 16px",
                  color: "rgba(255,255,255,0.75)",
                  fontSize: 13,
                }}
              >
                No expiry date. Active until changed.
              </div>
            )}
          </div>

          <div className="card-body" style={{ padding: "24px 28px" }}>
            <h6 className="fw-bold mb-3" style={{ color: COLORS.darkGreen, fontSize: 14 }}>
              Plan Limits
            </h6>

            <div style={{ color: "#3d6b5a", fontSize: 14 }}>
              <p className="mb-2">
                <strong>Max generations:</strong>{" "}
                {plan?.max_generations ?? "Unlimited"}
              </p>

              <p className="mb-2">
                <strong>Watermark:</strong>{" "}
                {plan?.watermark ? "Enabled" : "Removed"}
              </p>
            </div>

            {actionError && (
              <div
                className="alert mt-3 mb-0"
                style={{
                  backgroundColor: "#fee2e2",
                  color: "#991b1b",
                  border: "none",
                  borderRadius: 12,
                  fontSize: 13,
                }}
              >
                {actionError}
              </div>
            )}
          </div>
        </div>

        <div
          className="card border-0 mb-4"
          style={{
            borderRadius: 20,
            boxShadow: "0 4px 16px rgba(30,77,61,0.08)",
          }}
        >
          <div className="card-body" style={{ padding: "20px 28px" }}>
            <h6 className="fw-bold mb-3" style={{ color: COLORS.darkGreen, fontSize: 14 }}>
              Available Plans
            </h6>

            {plans.map((p) => (
              <PlanCard
                key={p.id}
                plan={p}
                currentPlanName={plan?.name}
                onSelect={handleChangePlan}
                upgrading={upgrading}
              />
            ))}
          </div>
        </div>

        <div
          className="card border-0"
          style={{
            borderRadius: 20,
            boxShadow: "0 4px 16px rgba(30,77,61,0.08)",
          }}
        >
          <div className="card-body" style={{ padding: "20px 28px" }}>
            <h6 className="fw-bold mb-3" style={{ color: COLORS.darkGreen, fontSize: 14 }}>
              Subscription History
            </h6>

            {history.length === 0 ? (
              <p className="text-muted mb-0">No subscription history found.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-sm align-middle">
                  <thead>
                    <tr>
                      <th>Plan</th>
                      <th>Status</th>
                      <th>Start</th>
                      <th>End</th>
                    </tr>
                  </thead>

                  <tbody>
                    {history.map((item) => (
                      <tr key={item.id}>
                        <td>{item.plan?.name || "-"}</td>
                        <td>
                          <StatusBadge status={item.status} />
                        </td>
                        <td>{item.start_date ? new Date(item.start_date).toLocaleDateString() : "-"}</td>
                        <td>{item.end_date ? new Date(item.end_date).toLocaleDateString() : "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}