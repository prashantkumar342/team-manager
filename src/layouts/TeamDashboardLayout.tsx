// layouts/HomeLayout.tsx
import { Outlet } from 'react-router-dom';

export default function TeamDashboardLayout() {
  return (
    <div className="bg-background">
      <Outlet />
    </div>
  );
}
