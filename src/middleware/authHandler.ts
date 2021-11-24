import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user";

export const authHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const JWT_KEY = process.env.JWT_KEY || "";
  //Get token from header
  const token = req.header("x-auth-token");

  //Check if token is present
  if (!token) {
    return res
      .status(401)
      .json({ msg: "No token found. Authorization Denied" });
  }

  // Verify token
  try {
    const usr = jwt.verify(token, JWT_KEY) as any;
    const user = await UserModel.findById(usr.userId);
    //@ts-ignore
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token invalid." });
  }
};
