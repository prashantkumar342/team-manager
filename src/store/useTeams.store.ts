// src/store/teamStore.ts
import type { Team } from '@/interfaces/Team';
import { create } from 'zustand';

interface TeamStore {
  teamsById: Map<string, Team>;
  teamIds: string[];
  teams: Team[];

  removeTeam: (id: string) => void;
  addTeam: (team: Team) => void;
  addTeams: (teams: Team[]) => void;
  updateTeam: (id: string, updatedFields: Partial<Team>) => void;
}

export const useTeamStore = create<TeamStore>((set) => ({
  teamsById: new Map(),
  teamIds: [],
  teams: [],

  addTeam: (team: Team) => {
    set((state) => {
      const map = new Map(state.teamsById);
      const ids = [...state.teamIds];

      if (!map.has(team._id)) ids.push(team._id);
      map.set(team._id, team);

      return {
        teamsById: map,
        teamIds: ids,
        teams: ids.map((id) => map.get(id)!).filter(Boolean),
      };
    });
  },

  addTeams: (teams) => {
    set((state) => {
      const map = new Map(state.teamsById);
      const ids = [...state.teamIds];

      for (const team of teams) {
        if (!map.has(team._id)) ids.push(team._id);
        map.set(team._id, team);
      }

      return {
        teamsById: map,
        teamIds: ids,
        teams: ids.map((id) => map.get(id)!).filter(Boolean),
      };
    });
  },

  updateTeam: (id: string, updatedFields: Partial<Team>) => {
    set((state) => {
      const map = new Map(state.teamsById);
      const existingTeam = map.get(id);

      // Only update if the team actually exists
      if (existingTeam) {
        // Merge: Keep existing, overwrite with new fields
        const mergedTeam = { ...existingTeam, ...updatedFields };
        map.set(id, mergedTeam);
      }

      return {
        teamsById: map,
        // Regenerate the list based on the updated map
        teams: state.teamIds.map((id) => map.get(id)!).filter(Boolean),
      };
    });
  },

  removeTeam: (id: string) => {
    set((state) => {
      const map = new Map(state.teamsById);
      const ids = [...state.teamIds];

      if (map.has(id)) {
        map.delete(id);
        ids.splice(ids.indexOf(id), 1);
      }

      return {
        teamsById: map,
        teamIds: ids,
        teams: ids.map((id) => map.get(id)!).filter(Boolean),
      };
    });
  },
}));
