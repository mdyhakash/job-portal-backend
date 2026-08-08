import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { IRegisterUser } from "./auth.interface";

const registerUser = async (payload: IRegisterUser) => {
  const { name, email, phone, password, role } = payload;

  //check user exists
  const isUserExists = await prisma.user.findUnique({
    where: { email },
  });

  if (isUserExists) {
    throw new Error("User Already Exists");
  }

  //hash password
  const hashPassword = await bcrypt.hash(password, config.bcrypt_salt_rounds);

  const createUser = await prisma.user.create({
    data: {
      email,
      name,
      phone,
      password: hashPassword,
      role,
      profile: {
        create: {},
      },
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      id: createUser.id,
      email: createUser.email,
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });

  return user;
};

export const authServices = {
  registerUser,
};
