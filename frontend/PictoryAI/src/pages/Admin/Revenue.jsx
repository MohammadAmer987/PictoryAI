import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Users as UsersIcon, Zap } from 'lucide-react';
import '../../css/admincss/Revenue.css';
import { getRevenueAnalytics } from '../../Services/adminService';

export default function Revenue() {
  const [revenueData, setRevenueData] = useState({
    totalRevenue: 0,
    totalActiveSubscriptions: 0,
    plans: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRevenueAnalytics();
      setRevenueData(data);
    } catch (err) {
      console.error('Failed to fetch revenue data:', err);
      setError(err.message || 'Failed to load revenue data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="revenuePage">
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading revenue data...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="revenuePage">
        <div style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
          Error: {error}
        </div>
      </section>
    );
  }

  return (
    <section className="revenuePage">
      <div className="revenueHeader">
        <div>
          <p className="revenueEyebrow">Revenue</p>
          <h2>Subscription Analytics</h2>
        </div>
        <div className="revenuePulse">
          <TrendingUp size={18} />
          <span>Financial Overview</span>
        </div>
      </div>

      {/* Revenue Overview Cards */}
      <div className="revenueOverview">
        <article className="revenueCard">
          <div className="revenueCardIcon" style={{ color: '#10b981' }}>
            <DollarSign size={24} />
          </div>
          <div className="revenueCardContent">
            <p className="revenueCardLabel">Monthly Revenue</p>
            <strong className="revenueCardValue">
              ${revenueData.totalRevenue.toFixed(2)}
            </strong>
            <span className="revenueCardDetail">
              From active subscriptions
            </span>
          </div>
        </article>

        <article className="revenueCard">
          <div className="revenueCardIcon" style={{ color: '#3b82f6' }}>
            <UsersIcon size={24} />
          </div>
          <div className="revenueCardContent">
            <p className="revenueCardLabel">Active Subscriptions</p>
            <strong className="revenueCardValue">
              {revenueData.totalActiveSubscriptions}
            </strong>
            <span className="revenueCardDetail">
              Paying customers
            </span>
          </div>
        </article>

        <article className="revenueCard">
          <div className="revenueCardIcon" style={{ color: '#f59e0b' }}>
            <Zap size={24} />
          </div>
          <div className="revenueCardContent">
            <p className="revenueCardLabel">Avg Revenue Per User</p>
            <strong className="revenueCardValue">
              ${(revenueData.totalActiveSubscriptions > 0 
                ? (revenueData.totalRevenue / revenueData.totalActiveSubscriptions).toFixed(2)
                : 0)}
            </strong>
            <span className="revenueCardDetail">
              Average subscription value
            </span>
          </div>
        </article>
      </div>

      {/* Plans Breakdown */}
      <div className="plansPanel">
        <div className="panelHeader">
          <div>
            <p className="panelEyebrow">Plans</p>
            <h3>Subscription Plans Breakdown</h3>
          </div>
        </div>

        <div className="plansTable">
          <div className="plansTableHeader">
            <div className="planCol planCol--name">Plan Name</div>
            <div className="planCol planCol--price">Price</div>
            <div className="planCol planCol--subscriptions">Active Subscriptions</div>
            <div className="planCol planCol--revenue">Monthly Revenue</div>
            <div className="planCol planCol--image">Max Image Gen</div>
            <div className="planCol planCol--caption">Max Caption Gen</div>
          </div>

          {revenueData.plans.map((plan) => (
            <div className="plansTableRow" key={plan.name}>
              <div className="planCol planCol--name">
                <strong>{plan.name}</strong>
              </div>
              <div className="planCol planCol--price">
                ${plan.price}
              </div>
              <div className="planCol planCol--subscriptions">
                <span className="subscriptionBadge">
                  {plan.activeSubscriptions}
                </span>
              </div>
              <div className="planCol planCol--revenue">
                <strong style={{ color: '#10b981' }}>
                  ${plan.monthlyRevenue.toFixed(2)}
                </strong>
              </div>
              <div className="planCol planCol--image">
                {plan.maxImageGenerations}
              </div>
              <div className="planCol planCol--caption">
                {plan.maxCaptionGenerations}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
