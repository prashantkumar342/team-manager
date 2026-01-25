import { LogOut, User, Settings, ChevronsUpDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Avatar, AvatarImage } from './ui/avatar';
import type { AuthUser } from '@/store/userStore';

export function ProfileDropdown({ user, onLogout }: { user: AuthUser | null; onLogout: () => void }) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="border border-border/50  backdrop-blur-sm  hover:shadow-md transition-all rounded-md">
              <div className="h-10 w-10 rounded-lg bg-linear-to-br from-primary/80 to-primary flex items-center justify-center text-primary-foreground font-semibold">
                {user?.avatar ? (
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} />
                  </Avatar>
                ) : (
                  <span>{user?.name?.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-bold">{user?.name}</span>
                <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
              </div>
              <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56 rounded-xl border-border/50 bg-card/95 backdrop-blur-sm"
            align="start"
            side="right"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground font-semibold">Account</DropdownMenuLabel>
            <DropdownMenuItem className="rounded-lg cursor-pointer">
              <div className="p-1 rounded-md bg-primary/10 mr-2">
                <User className="h-4 w-4 text-primary" />
              </div>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg cursor-pointer">
              <div className="p-1 rounded-md bg-primary/10 mr-2">
                <Settings className="h-4 w-4 text-primary" />
              </div>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="rounded-lg cursor-pointer text-destructive focus:text-destructive">
              <div className="p-1 rounded-md bg-destructive/10 mr-2">
                <LogOut className="h-4 w-4 text-destructive" />
              </div>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
