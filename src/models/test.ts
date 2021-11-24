import { model, Schema } from "mongoose";

export interface Option {
  id: number;
  value: string;
}

export interface Question {
  question: string;
  options: Option[];
  correctAnswerId: number;
}

export interface Test {
  email: string;
  questions: Question[];
}

const testSchema = new Schema<Test>({
  email: {
    type: String,
    required: true,
  },
  questions: [
    {
      question: {
        type: String,
        required: true,
      },
      options: [
        {
          id: Number,
          value: String,
        },
      ],
      correctAnswerId: {
        type: Number,
        required: true,
      },
    },
  ],
});

export const TestModel = model<Test>("Test", testSchema);
