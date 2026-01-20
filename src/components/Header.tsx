import { ArrowLeft, Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import React from 'react';
import { ButtonGroup } from './ui/button-group';
import { SidebarTrigger } from './ui/sidebar';
import { useSettingsStore } from '@/store/useSettings';

export default function Header({
  chip = false,
  showBack = true,
  chipText,
  title,
  subtitle,
  rightAction,
}: {
  chip?: boolean;
  showBack?: boolean;
  chipText?: string;
  title?: string;
  subtitle?: string | React.ReactNode | (() => React.ReactNode);
  rightAction?: () => React.ReactNode;
}) {
  const { themeMode, setThemeMode } = useSettingsStore();
  // Helper to render subtitle based on its type
  const renderSubtitle = () => {
    if (!subtitle) return null;

    // If it's a function, execute it
    if (typeof subtitle === 'function') {
      return subtitle();
    }

    // If it's a string, wrap it in a <p> tag
    if (typeof subtitle === 'string') {
      return <p className="text-sm text-muted-foreground">{subtitle}</p>;
    }

    // Otherwise, render it directly (JSX/ReactNode)
    return subtitle;
  };

  const renderRightAction = () => {
    if (!rightAction) return null;

    return rightAction();
  };

  return (
    <div className="border-b bg-card">
      <div className="px-3 py-5 flex items-center gap-4">
        <div className="flex-1 flex items-center">
          {showBack && (
            <Button variant="ghost" size="icon" className="shrink-0 rounded-xl" onClick={() => window.history.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}

          <div className="px-3">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-foreground">{title}</h1>
              {chip && <div className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">{chipText}</div>}
            </div>
            {/* Render the processed subtitle */}
            {renderSubtitle()}
          </div>
        </div>
        <div className="flex gap-2">{renderRightAction()}</div>
        <ButtonGroup>
          <SidebarTrigger variant="outline" className="size-9" />
          <Button onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')} size="icon" variant="outline">
            {themeMode === 'dark' ? <Sun /> : <Moon />}
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
}
