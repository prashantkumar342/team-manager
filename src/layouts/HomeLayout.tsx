// layouts/HomeLayout.tsx
import AssistantButton from '@/components/assistant/AssistantButton';
import { Outlet } from 'react-router-dom';

export default function HomeLayout() {
  return (
    <div className=" bg-background ">
      <Outlet />
      <AssistantButton />
    </div>
  );
}
