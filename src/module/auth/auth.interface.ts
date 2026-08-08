import { Role } from "../../../generated/prisma/enums";

export interface IRegisterUser {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: Role;
}

export interface ILoginUser {
  email: string;
  password: string;
  role: Role;
}

export interface IUpdateProfile {
  name?: string;
  email?: string;
  phone?: string;
  bio?: string;
  skills?: string;
  experience?: string;
  education?: string;
}
