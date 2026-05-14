import { useState, useEffect } from 'react';
import {
  BarChart3,
  Image,
  Layers,
  MessageSquareText,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import '../../css/admincss/Analytics.css';
import { getAnalytics } from '../../Services/adminService';

const iconMap = {
  Image: Image,
  Sparkles: Sparkles,
  Layers: Layers,
  MessageSquareText: MessageSquareText,
  Users: Users,
  BarChart3: BarChart3,
};

export default function Analytics() {
  const [analyticsData, setAnalyticsData] = useState({
    overview: [],
    featureStats: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAnalytics();
      setAnalyticsData(data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="analyticsPage">
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading analytics...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="analyticsPage">
        <div style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
          Error: {error}
        </div>
      </section>
    );
  }

  const maxUsers = analyticsData.featureStats.length > 0
    ? Math.max(...analyticsData.featureStats.map((feature) => feature.users))
    : 1;

  return (
    <section className="analyticsPage">
      <div className="analyticsHeader">
        <div>
          <p className="analyticsEyebrow">Analytics</p>
          <h2>Platform Statistics</h2>
        </div>
        <div className="analyticsPulse">
          <TrendingUp size={18} />
          <span>Overview</span>
        </div>
      </div>

      <div className="analyticsOverview">
        {analyticsData.overview.map((stat) => {
          const Icon = iconMap[stat.icon] || Users;

          return (
            <article className="analyticsCard" key={stat.label}>
              <div className="analyticsIcon">
                <Icon size={22} />
              </div>
              <p>{stat.label}</p>
              <strong>{stat.value.toLocaleString()}</strong>
              <span>{stat.detail}</span>
            </article>
          );
        })}
      </div>

      <div className="featureUsagePanel">
        <div className="panelTitleRow">
          <div>
            <p className="analyticsEyebrow">Feature usage</p>
            <h3>Users by Feature</h3>
          </div>
          <span className="panelNote">Unique users</span>
        </div>

        <div className="featureStatsGrid">
          {analyticsData.featureStats.map((feature) => {
            const Icon = iconMap[feature.icon] || Image;
            const percentage = Math.round((feature.users / maxUsers) * 100);

            return (
              <article className="featureStatCard" key={feature.name}>
                <div className="featureTopRow">
                  <div className="featureIcon" style={{ color: feature.color }}>
                    <Icon size={21} />
                  </div>
                  <div>
                    <h4>{feature.name}</h4>
                    <p>{feature.total.toLocaleString()} total uses</p>
                  </div>
                </div>

                <div className="featureMetric">
                  <strong>{feature.users}</strong>
                  <span>users</span>
                </div>

                <div className="usageTrack" aria-hidden="true">
                  <span
                    className="usageFill"
                    style={{
                      width: `${percentage}%`,
                      background: feature.color,
                    }}
                  />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}