export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: Date | null;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};
