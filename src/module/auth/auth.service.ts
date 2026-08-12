import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { ILoginUser, IRegisterUser } from "./auth.interface";
import { jwtUtils } from "../../utils/jwt";
import { SignOptions } from "jsonwebtoken";

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

const loginUser = async (payload: ILoginUser) => {
  const { email, password } = payload;

  const user = await prisma.user.findFirstOrThrow({
    where: {
      email,
    },
  });

  const matchedPassword = await bcrypt.compare(password, user.password);
  if (!matchedPassword) {
    throw new Error("Invalid Credintials");
  }
  const jwtpayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtpayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );
  const refreshToken = jwtUtils.createToken(
    jwtpayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as SignOptions,
  );

  return { accessToken, refreshToken };
};

export const authServices = {
  registerUser,
  loginUser,
};
