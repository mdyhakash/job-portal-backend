import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authServices } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const result = await authServices.registerUser(payload);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      message: "User registered successfully",
      data: { result },
    });
  },
);
const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const { accessToken, refreshToken } = await authServices.loginUser(payload);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "User logged in successfully",
      data: { accessToken, refreshToken },
    });
  },
);

const logoutUser = catchAsync(async (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Logged out successfully",
    data: null,
  });
});

export const authController = {
  registerUser,
  loginUser,
  logoutUser,
};
