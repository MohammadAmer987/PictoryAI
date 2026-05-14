import '../../css/admincss/StatCard.css';
import Icon from './Icon';

export default function StatCard({ label, value, sub, trend }) {
  return (
    <div className="card">
      <p className="label">{label}</p>
      <p className="value">{value}</p>
      <div className="footer">
        {trend === 'up' && (
          <Icon name="trendUp" size={12} className="trendIcon" />
        )}
        <span className="sub">{sub}</span>
      </div>
    </div>
  );
}
