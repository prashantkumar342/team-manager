import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Users, Phone, Video, Info, Paperclip, Smile } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { auth } from '@/lib/firebase';
import { toast } from 'sonner';
import { useUserStore } from '@/store/userStore';
import { useMessage } from '@/api/hook/useMessage';
import type { Message } from '@/interfaces/Message';
import Header from '@/components/Header';

export default function TeamChat() {
  const { id: teamId } = useParams<{ id: string }>();
  const { user } = useUserStore();

  const { joinTeamRoom, leaveTeamRoom, onNewMessage, offNewMessage, getMessages, sendMessage } = useMessage();

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const tokenRef = useRef<string | null>(null);
  const listenerAttached = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        if (!teamId) return;

        const token = await auth.currentUser?.getIdToken();
        if (!token) throw new Error('Unauthorized');
        tokenRef.current = token;

        const res = await getMessages(teamId, token);
        if (mounted && res.success) {
          setMessages(res.data.messages.reverse());
        }

        joinTeamRoom(token, teamId);

        if (!listenerAttached.current) {
          onNewMessage(token, (msg) => {
            setMessages((prev) => (prev.some((m) => m._id === msg._id) ? prev : [...prev, msg]));
          });
          listenerAttached.current = true;
        }
      } catch (e: unknown) {
        if (e instanceof Error) {
          toast.error(e.message);
        } else {
          toast.error('Failed to load chat');
        }
      }
    }

    init();

    return () => {
      mounted = false;
      const token = tokenRef.current;
      if (token && teamId) {
        leaveTeamRoom(token, teamId);
        offNewMessage(token);
        listenerAttached.current = false;
      }
    };
  }, [teamId, getMessages, joinTeamRoom, leaveTeamRoom, onNewMessage, offNewMessage]);

  const handleSend = async () => {
    if (!text.trim() || !teamId) return;

    const token = tokenRef.current ?? (await auth.currentUser?.getIdToken());
    if (!token) return;

    const res = await sendMessage(text.trim(), teamId, token);
    if (!res.success) {
      toast.error(res.error || 'Failed to send message');
    }

    setText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-purple-500 to-purple-600',
      'from-green-500 to-green-600',
      'from-pink-500 to-pink-600',
      'from-orange-500 to-orange-600',
      'from-emerald-500 to-emerald-600',
      'from-cyan-500 to-cyan-600',
      'from-indigo-500 to-indigo-600',
    ];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  const headerRightAction = () => {
    return (
      <div className="flex items-center gap-2 shrink-0">
        <Button variant="ghost" size="icon" className="hidden sm:flex rounded-xl">
          <Phone className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="hidden sm:flex rounded-xl">
          <Video className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-xl">
          <Info className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="flex h-screen flex-col bg-linear-to-br from-background via-background to-muted/20 overflow-hidden">
      <Header title="Team Chat" subtitle="Team members" rightAction={headerRightAction} />

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm max-w-md">
              <CardContent className="p-8 text-center">
                <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 md:h-10 md:w-10 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
                <p className="text-sm text-muted-foreground">Start the conversation with your team!</p>
              </CardContent>
            </Card>
          </div>
        ) : (
          messages.map((m) => {
            const isMe = m.senderId._id === user?.id;
            const senderName = m.senderId.name || 'Unknown';
            const initials = getInitials(senderName);
            const avatarlinear = getAvatarColor(senderName);

            return (
              <div key={m._id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'} items-start`}>
                <div
                  className={`shrink-0 h-8 w-8 md:h-10 md:w-10 rounded-full flex items-center justify-center text-white font-semibold text-xs md:text-sm shadow-sm ${
                    isMe ? 'bg-linear-to-br from-primary/80 to-primary' : `bg-linear-to-br ${avatarlinear}`
                  }`}
                >
                  {initials}
                </div>

                <div className={`flex flex-col max-w-[85%] sm:max-w-[70%] md:max-w-[60%] ${isMe ? 'items-end' : 'items-start'}`}>
                  {!isMe && <span className="text-xs font-medium text-muted-foreground mb-1 px-1">{senderName}</span>}
                  <div
                    className={`rounded-2xl px-4 py-2.5 shadow-sm ${
                      isMe ? 'bg-primary text-primary-foreground' : 'bg-card/50 backdrop-blur-sm text-foreground border border-border/50'
                    }`}
                  >
                    <p className="text-sm md:text-base wrap-break-words whitespace-pre-wrap">{m.content}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1 px-1">
                    {new Date(m.createdAt).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className="shrink-0 border-t border-border/50 bg-card/50 backdrop-blur-sm p-4 md:p-6">
        <div className="flex items-end gap-2 md:gap-3 max-w-4xl mx-auto">
          <Button variant="ghost" size="icon" className="shrink-0 hidden sm:flex rounded-xl">
            <Paperclip className="h-5 w-5" />
          </Button>

          <div className="flex-1 relative">
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              className="pr-10 md:pr-12 h-11 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus-visible:ring-primary"
            />
            <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 hidden sm:flex rounded-lg">
              <Smile className="h-4 w-4" />
            </Button>
          </div>

          <Button
            onClick={handleSend}
            size="icon"
            className="shrink-0 h-11 w-11 rounded-xl shadow-lg shadow-primary/20"
            disabled={!text.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
