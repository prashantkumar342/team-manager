export interface Message {
  _id: string;
  content: string;
  senderId: {
    _id: string;
    name: string;
    email: string;
  };
  teamId: string;

  createdAt: Date;
  updatedAt: Date;
}
