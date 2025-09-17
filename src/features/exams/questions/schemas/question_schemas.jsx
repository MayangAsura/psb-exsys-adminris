// schemas/questionSchema.js
import { z } from "zod";

const answerSchema = z.object({
  text: z.string().min(1, "Answer text is required"),
  score: z.number().min(0, "Score must be at least 0"),
  isCorrect: z.boolean(),
  image: z.string().optional()
});

export const questionSchema = z.object({
  questionType: z.string().min(1, "Tipe pertanyaan wajib diisi."),
  questionText: z.string().min(1, "Question text is required"),
  questionImage: z.string().optional(),
  answers: z.array(answerSchema).length(4, "Exactly 4 answers required"),
  explanation: z.string().optional()
});