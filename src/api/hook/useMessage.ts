import { useCallback } from 'react';
import axios from '@/lib/axios';
import { getSocket } from '@/lib/socket';
import type { Message } from '@/interfaces/Message';

export const useMessage = () => {
  // ================= join / leave =================
  const joinTeamRoom = useCallback((token: string, teamId: string) => {
    const socket = getSocket(token);
    socket.emit('join-team', { teamId });
  }, []);

  const leaveTeamRoom = useCallback((token: string, teamId: string) => {
    const socket = getSocket(token);
    socket.emit('leave-team', { teamId });
  }, []);

  // ================= listeners =================
  const onNewMessage = useCallback((token: string, cb: (msg: Message) => void) => {
    const socket = getSocket(token);
    socket.on('new-message', cb);
  }, []);

  const offNewMessage = useCallback((token: string) => {
    const socket = getSocket(token);
    socket.off('new-message');
  }, []);

  // ================= REST APIs =================
  const getMessages = useCallback(async (teamId: string, token: string) => {
    const res = await axios.get(`/message/get-messages?teamId=${teamId}`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });

    return res.data;
  }, []);

  const sendMessage = useCallback(async (content: string, teamId: string, token: string) => {
    const res = await axios.post(
      `/message/send?teamId=${teamId}`,
      { content },
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      },
    );

    return res.data;
  }, []);

  return {
    joinTeamRoom,
    leaveTeamRoom,
    onNewMessage,
    offNewMessage,
    getMessages,
    sendMessage,
  };
};
