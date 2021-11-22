import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authHandler = (
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
    jwt.verify(token, JWT_KEY);
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token invalid." });
  }
};
