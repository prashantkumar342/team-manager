// layouts/HomeLayout.tsx
import { Outlet } from 'react-router-dom';

export default function HomeLayout() {
  return (
    <div className=" bg-background ">
      <Outlet />
    </div>
  );
}
