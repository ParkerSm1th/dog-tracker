export type ClerkUser = Partial<{
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar: string;
  roles: string[];
  createdAt: Date;
  updatedAt: Date;
}>;

export type ClerkJWT = {
  sub: string;
  image?: string;
};
