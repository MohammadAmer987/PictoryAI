import {
  ArrowUpRight,
  BarChart3,
  Bell,
  Check,
  Home,
 
  LogOut,
  Search,
  Settings,
  Users,
} from 'lucide-react';

const icons = {
  analytics: BarChart3,
  bell: Bell,
  check: Check,
  dashboard: Home,
  logout: LogOut,
  search: Search,
  settings: Settings,
  trendUp: ArrowUpRight,
  users: Users,
};

export default function Icon({ name, size = 16, className }) {
  const Component = icons[name] || Home;
  return <Component className={className} size={size} strokeWidth={1.8} />;
}
