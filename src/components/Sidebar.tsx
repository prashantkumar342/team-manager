import { Home, LogOut } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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

export default function AppSidebar() {
  const menuItems = [{ icon: Home, label: 'home', href: '/home' }];
  const handleLogout = async () => {
    try {
      // Logout from Firebase
      await signOut(auth);

      // Optional: tell backend to clear cookie
      await axios.post('/auth/logout', {}, { withCredentials: true });
      // console.log(await auth.currentUser?.getIdToken());
    } catch (error) {
      console.error('Logout failed', error);
    }
  };
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-4">
          <h2 className="text-xl font-bold">Team Manager</h2>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild>
                    <Link to={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => handleLogout()}>
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
