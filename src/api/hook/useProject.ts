import { useCallback } from 'react';
import axios from '../../lib/axios';

export const useProject = () => {
  // Memoizing getProjects to prevent infinite loops in useEffect
  const getProjects = useCallback(async (teamId: string, token: string) => {
    const response = await axios.get(`/project/projects?teamId=${teamId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    return response.data;
  }, []);

  const createProject = useCallback(async (name: string, description: string, teamId: string, token: string) => {
    const response = await axios.post(
      `/project/create`,
      {
        name,
        description,
        teamId,
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

  const updateProject = useCallback(async (projectId: string, name: string, description: string, token: string) => {
    const response = await axios.put(
      `/project/update/${projectId}`,
      {
        name,
        description,
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

  const deleteProject = useCallback(async (projectId: string, token: string) => {
    const response = await axios.delete(`/project/delete/${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    return response.data;
  }, []);

  return {
    getProjects,
    createProject,
    updateProject,
    deleteProject,
  };
};
