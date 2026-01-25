import axios from '../../lib/axios';

export const useAssistant = () => {
  const askAssistant = async (message: string, token: string) => {
    if (!message.trim()) {
      throw new Error('Message is required');
    }

    const res = await axios.post(
      '/assistant/chat',
      { message },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.data;
  };

  return { askAssistant };
};
