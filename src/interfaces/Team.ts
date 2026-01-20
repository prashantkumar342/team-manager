export type Team = {
  _id: string;
  adminId: string;
  description: string;
  name: string;
  managerId?: string;
  createdAt: string;
  updatedAt: string;
};

export type TeamMember = {
  _id: string; // membership id
  role: 'ADMIN' | 'MANAGER' | 'MEMBER';
  joinedAt: string;
  userId: {
    _id: string;
    uid: string;
    name: string;
    email: string;
  };
};
