import { SidebarTrigger } from '@/components/ui/sidebar';
import { Moon, Sun } from 'lucide-react';
import { Button } from '../components/ui/button';
import { ButtonGroup } from '../components/ui/button-group';
import { useSettingsStore } from '@/store/useSettings';

function Navbar() {
  const { themeMode, setThemeMode } = useSettingsStore();

  return (
    <nav className="h-fit w-full flex items-center justify-between fixed top-0 px-5 py-2 bg-background  backdrop-blur-sm  z-10">
      <ButtonGroup>
        <SidebarTrigger variant="outline" className="size-9" />
        <Button onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')} size="icon" variant="outline">
          {themeMode === 'dark' ? <Sun /> : <Moon />}
        </Button>
      </ButtonGroup>
    </nav>
  );
}

export default Navbar;
