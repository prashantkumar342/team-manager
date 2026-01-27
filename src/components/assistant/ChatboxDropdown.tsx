import { useState, useEffect, useRef } from 'react';
import { DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Send, Bot, User } from 'lucide-react';
import { useAssistant } from '@/api/hook/useAssistent';
import { auth } from '@/lib/firebase';
import { toast } from 'sonner';

type Message = {
  id: number;
  role: 'user' | 'assistant';
  content: string;
};

export function ChatboxDropdown() {
  const { askAssistant } = useAssistant();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: 'Hello! How can I assist you today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const token = await auth.currentUser?.getIdToken();

    if (!token) {
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await askAssistant(userMessage.content, token);
      console.log(res);
      const aiMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: res.data.answer,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          role: 'assistant',
          content: 'Something went wrong. Please try again.',
        },
      ]);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <DropdownMenuContent className="w-[calc(100vw-2rem)] sm:w-96 md:w-md p-0 h-[80vh] sm:h-150" align="end" sideOffset={8}>
      {/* Header */}
      <div className="flex items-center gap-2 p-3 sm:p-4 border-b">
        <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-sm sm:text-base">AI Assistant</h3>
          <p className="text-xs text-muted-foreground">{loading ? 'Typing...' : 'Online'}</p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 h-[calc(80vh-140px)] sm:h-105 p-3 sm:p-4">
        <div className="space-y-3 sm:space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-2 sm:gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                <AvatarFallback className={message.role === 'user' ? 'bg-secondary' : 'bg-primary text-primary-foreground'}>
                  {message.role === 'user' ? <User className="h-3 w-3 sm:h-4 sm:w-4" /> : <Bot className="h-3 w-3 sm:h-4 sm:w-4" />}
                </AvatarFallback>
              </Avatar>

              <Card
                className={`p-2 sm:p-3 max-w-[75%] sm:max-w-[80%] ${
                  message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}
              >
                <p className="text-xs sm:text-sm leading-relaxed wrap-break-words">{message.content}</p>
              </Card>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="h-3 w-3 sm:h-4 sm:w-4" />
                </AvatarFallback>
              </Avatar>
              <Card className="p-2 sm:p-3 bg-muted">
                {/*<p className="text-xs sm:text-sm">Thinking...</p>*/}
                <div className="flex gap-1 bg-card">
                  <span className="h-2 w-2 bg-card-foreground rounded-full animate-pulse"></span>
                  <span className="h-2 w-2 bg-card-foreground rounded-full animate-pulse delay-150"></span>
                  <span className="h-2 w-2 bg-card-foreground rounded-full animate-pulse delay-300"></span>
                </div>
              </Card>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <Separator />

      {/* Input */}
      <div className="p-3 sm:p-4 ">
        <div className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyUp={handleKeyPress}
            disabled={loading}
          />
          <Button size="icon" onClick={handleSend} disabled={!input.trim() || loading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </DropdownMenuContent>
  );
}
