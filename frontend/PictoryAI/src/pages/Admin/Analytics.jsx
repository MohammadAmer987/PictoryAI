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

const overviewStats = [
  {
    label: 'Registered Users',
    value: '1,248',
    detail: '+86 new accounts this month',
    icon: Users,
  },
  {
    label: 'Feature Usage',
    value: '10,890',
    detail: 'Total usage across all tools',
    icon: BarChart3,
  },
];

const featureStats = [
  {
    name: 'Image Generation',
    users: 426,
    total: 1390,
    icon: Image,
    color: '#376359',
  },
  {
    name: 'Image Enhancement',
    users: 318,
    total: 940,
    icon: Sparkles,
    color: '#5f8f83',
  },
  {
    name: 'Theme Image',
    users: 274,
    total: 760,
    icon: Layers,
    color: '#7f6f52',
  },
  {
    name: 'Caption Generation',
    users: 512,
    total: 1800,
    icon: MessageSquareText,
    color: '#4f6f87',
  },
];

const maxUsers = Math.max(...featureStats.map((feature) => feature.users));

export default function Analytics() {
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
        {overviewStats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article className="analyticsCard" key={stat.label}>
              <div className="analyticsIcon">
                <Icon size={22} />
              </div>
              <p>{stat.label}</p>
              <strong>{stat.value}</strong>
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
          {featureStats.map((feature) => {
            const Icon = feature.icon;
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