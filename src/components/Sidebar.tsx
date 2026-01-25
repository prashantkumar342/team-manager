import { Home, LayoutDashboard } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import axios from '@/lib/axios';
import { Link } from 'react-router-dom';
import { ProfileDropdown } from './ProfileDropdown';
import { useUserStore } from '@/store/userStore';
import { useConfirm } from '@/hook/useConfirm';

export default function AppSidebar() {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Home, label: 'My Teams', href: '/home' },
  ];
  const { user } = useUserStore();
  const confirm = useConfirm();

  const handleLogout = async () => {
    const ok = await confirm({
      title: 'Logout',
      description: 'Are you sure you want to logout?',
      confirmText: 'Yes, Logout',
    });
    if (!ok) {
      return;
    } else {
      try {
        await signOut(auth);
        await axios.post('/auth/logout', {}, { withCredentials: true });
      } catch (error) {
        console.error('Logout failed', error);
      }
    }
  };

  return (
    <Sidebar className="bg-linear-to-b from-background to-muted/20 border-r border-border/50">
      <SidebarHeader>
        <ProfileDropdown user={user} onLogout={handleLogout} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground font-semibold">Team Manager</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    className="rounded-md py-5 border border-border/50  backdrop-blur-sm  hover:shadow-md transition-all"
                  >
                    <Link to={item.href}>
                      <div className="p-1.5 rounded-md bg-primary/10">
                        <item.icon className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
