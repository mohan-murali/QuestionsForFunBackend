import { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authHandler } from "../middleware/authHandler";
import { User, UserModel } from "../models/user";
import * as dotenv from "dotenv";

dotenv.config();

const loginRouter = Router();
const JWT_KEY = process.env.JWT_KEY || "";

export interface RequestWithBody extends Request {
  [x: string]: any;
  body: { [key: string]: string | undefined };
}

loginRouter.get("/", (req: Request, res: Response) => {
  res.send("you have been logged in");
});

loginRouter.get("/logout", (req: Request, res: Response) => {
  req.session = undefined;
  res.redirect("/");
});

loginRouter.get(
  "/protected",
  authHandler,
  (req: RequestWithBody, res: Response) => {
    console.log(req.user);
    res.send("welcome to the protected route");
  }
);

loginRouter.post("/signUp", async (req: RequestWithBody, res: Response) => {
  try {
    const { name, email, password, type } = req.body;

    if (name && email && password && type) {
      //Check if the email and password is correct
      const user: User = {
        name,
        email,
        password,
        type,
      };

      let userCheck = await UserModel.findOne({ email: email });
      if (userCheck) {
        res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }

      let newUser = new UserModel(user);
      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(newUser.password, salt);
      newUser = await newUser.save();

      const token = jwt.sign({ userId: newUser._id }, JWT_KEY, {
        expiresIn: "24h",
      });

      res.cookie("ss-token", token, {
        httpOnly: true,
      });

      res.status(200).json({
        user: {
          name: newUser.name,
          email: newUser.email,
          type: newUser.type,
        },
        success: true,
        message: "user created successfully",
      });
    } else
      res.status(400).json({
        success: false,
        message: "You need to send name, email, password and type",
      });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `cannot retrieve user, error: ${err}`,
    });
  }
});

loginRouter.post("/login", async (req: RequestWithBody, res: Response) => {
  try {
    const { email, password } = req.body;

    if (email && password) {
      //Check if the email and password is correct
      const user = await UserModel.findOne({ email: email });

      if (user) {
        const passwordMatched = await bcrypt.compare(
          password as string,
          user.password
        );
        if (passwordMatched) {
          const token = jwt.sign({ userId: user._id }, JWT_KEY, {
            expiresIn: "24h",
          });

          res.cookie("ss-token", token, {
            httpOnly: true,
          });

          return res.status(200).json({
            success: true,
            user,
          });
        } else {
          return res.status(403).json({
            success: false,
            message: "email and password did not match",
          });
        }
      }
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    } else
      res.status(400).json({
        success: false,
        message: "You need to send email and password",
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: `cannot retrieve user, error: ${err}`,
    });
  }
});

export { loginRouter };
