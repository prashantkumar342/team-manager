import { MessageCircleMore } from 'lucide-react';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { ChatboxDropdown } from './ChatboxDropdown';

export default function AssistantButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="fixed bottom-6 right-6 z-50">
          {/* Animated glow rings */}
          <div className="absolute inset-0 animate-ping opacity-20">
            <div className="h-14 w-14 rounded-full bg-linear-to-br from-indigo-500 to-violet-600" />
          </div>

          {/* Outer glow */}
          <div className="absolute -inset-2 rounded-full bg-linear-to-br from-indigo-500/30 via-violet-500/30 to-fuchsia-500/30 blur-lg" />

          <Button
            size="icon"
            aria-label="Open AI Assistant"
            className="
          relative h-14 w-14 rounded-full
          bg-linear-to-br from-indigo-500 via-violet-600 to-fuchsia-600
          text-white shadow-2xl
          transition-all duration-300 ease-out
          hover:scale-110 hover:shadow-violet-500/50
          hover:from-indigo-400 hover:via-violet-500 hover:to-fuchsia-500
          active:scale-95
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2
          group overflow-hidden
        "
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

            {/* Icons with animation */}
            <div className="">
              <MessageCircleMore className="  h-6 w-6 transition-all duration-300 group-hover:scale-110" />
            </div>

            {/* Tooltip */}
            <span
              className="
          absolute -top-12 left-1/2 -translate-x-1/2
          px-3 py-1.5 rounded-lg
          bg-gray-900 text-white text-sm font-medium
          opacity-0 group-hover:opacity-100
          transition-opacity duration-200
          whitespace-nowrap pointer-events-none
          shadow-lg
        "
            >
              Chat with AI
            </span>
          </Button>
        </div>
      </DropdownMenuTrigger>
      <ChatboxDropdown />
    </DropdownMenu>
  );
}
