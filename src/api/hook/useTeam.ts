import axios from '../../lib/axios';

import { useCallback } from 'react';

export const useGetTeam = () => {
  const getTeams = useCallback(async (offset = 0, limit = 10, token: string) => {
    const response = await axios.get(`/team/get-teams?offset=${offset}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    return response;
  }, []); // Empty array means this function reference never changes

  const getTeamById = useCallback(async (id: string, token: string) => {
    const response = await axios.get(`/team/get-team/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    return response.data;
  }, []);

  const deleteTeam = useCallback(async (id: string, token: string) => {
    const response = await axios.delete(`/team/delete/?teamId=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    return response.data;
  }, []);

  const updateTeam = useCallback(async (id: string, name: string, description: string, token: string) => {
    const response = await axios.put(
      `/team/update/?teamId=${id}`,
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

  const getTeamMembers = useCallback(async (id: string, offset: number, limit: number, token: string) => {
    const response = await axios.get(
      `/team/get-team-members/?teamId=${id}&offset=${offset}&limit=${limit}`,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      },
    );
    return response.data;
  }, []);

  return {
    getTeams,
    getTeamById,
    getTeamMembers,
    updateTeam,
    deleteTeam,
  };
};
export const useAddTeamMember = () => {
  const addMember = useCallback(async (teamId: string, email: string, token: string) => {
    const response = await axios.post(
      `/team/add-member?teamId=${teamId}`,
      { email },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      },
    );
    return response.data;
  }, []);

  return { addMember };
};
export const useRemoveTeamMember = () => {
  const removeMember = useCallback(async (teamId: string, userId: string, token: string) => {
    const response = await axios.post(
      `/team/remove-member/?teamId=${teamId}`,
      { userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      },
    );
    return response.data;
  }, []);

  return { removeMember };
};

export const useUpdateTeamMemberRole = () => {
  const updateMemberRole = useCallback(async (teamId: string, userId: string, role: 'MEMBER' | 'MANAGER', token: string) => {
    const response = await axios.put(
      `/team/update-member-role/?teamId=${teamId}`,
      { userId, role },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      },
    );
    return response.data;
  }, []);

  return { updateMemberRole };
};

export const useCreateTeam = () => {
  async function createTeam(name: string, description: string, token: string) {
    const response = await axios.post(
      `/team/create-team`,
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
  }

  return {
    createTeam,
  };
};
