import * as dotenv from "dotenv";
import { Router, Response } from "express";
import { RequestWithBody } from ".";
import { authHandler } from "../middleware/authHandler";
import { Test, TestModel } from "../models/test";

dotenv.config();

const testRouter = Router();

testRouter.post(
  "/test",
  authHandler,
  async (req: RequestWithBody, res: Response) => {
    try {
      const user = req.user;
      const { questions } = req.body as any;

      const test: Test = {
        questions: questions,
        email: user.email,
      };
      let newTest = new TestModel(test);
      newTest = await newTest.save();

      res.status(200).json({
        success: true,
        message: "Test saved successfully",
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Failed to save test",
      });
    }
  }
);

export { testRouter };
