export type User = {
  id: string;
  name: string | null;
  image: string | null;
  email: string;
  password: string | null;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
