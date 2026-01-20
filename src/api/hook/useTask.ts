import { useCallback } from 'react';
import axios from '../../lib/axios';
import { type TaskStatus } from '@/interfaces/Task';

export const useTask = () => {
  // Memoize getTasks to safely use in useEffect dependency arrays
  const getTasks = useCallback(async (projectId: string, token: string, teamId?: string) => {
    const response = await axios.get(`/task/tasks?projectId=${projectId}&teamId=${teamId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    return response.data;
  }, []);

  // Memoize createTask
  const createTask = useCallback(async (title: string, description: string, projectId: string, token: string, teamId: string) => {
    const response = await axios.post(
      `/task/create?teamId=${teamId}`,
      {
        title,
        description,
        projectId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      },
    );

    return response.data;
  }, []);

  // Memoize updateTask
  const updateTask = useCallback(
    async (taskId: string, status: TaskStatus, assignedTo: string | undefined, token: string, teamId: string) => {
      const response = await axios.put(
        `/task/update/${taskId}?teamId=${teamId}`,
        {
          status,
          assignedTo,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        },
      );

      return response.data;
    },
    [],
  );

  // Memoize deleteTask
  const deleteTask = useCallback(async (taskId: string, token: string, teamId: string) => {
    const response = await axios.delete(`/task/delete/${taskId}?teamId=${teamId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    return response.data;
  }, []);

  return {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
  };
};
