export interface User {
  id: string;

  phoneNumber: string | null;

  firstName: string | null;
  lastName: string | null;
  image?: string | null;

  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  firstName: string;
  id: string;
  lastName: string;
  phoneNumber: string;
}
