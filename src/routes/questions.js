const express = require("express");
const router = express.Router();
const prisma = require("../lib/prisma");

// GET /questions
// List all questions
router.get("/", async (req, res) => {
    
    const questions = await prisma.question.findMany({
    orderBy: { id: "asc" },
  });

  res.json(questions);
});

  // GET /questions/:questionId
// Show a specific question
router.get("/:questionId", async (req, res) => {
  const questionId = Number(req.params.questionId);

  const question = await prisma.question.findUnique({
    where: { id: questionId }
  });

  if (!question) {
    return res.status(404).json({ message: "Question not found" });
  }
  res.json(question);

});

// POST /questions
// Create a new question
router.post("/", async (req, res) => {

  const { question, answer } = req.body;

  if (!question || !answer) {
    return res.status(400).json({
      message: "question and answer are required"
    });
  }

  const newQuestion = await prisma.question.create({
    data: {
      question, answer
    },
  });

  res.status(201).json(newQuestion);
});

// PUT /questions/:questionId
// Edit a question
router.put("/:questionId", async (req, res) => {

    const questionId = Number(req.params.questionId);
    const { question, answer } = req.body;

    const existingQuestion = await prisma.question.findUnique({ where: { id: questionId } });
    if (!existingQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    if (!question || !answer) {
      return res.json({
        message: "question and answer are required"
      });
  }

  const updatedQuestion = await prisma.question.update({
    where: { id: questionId },
    data: {
      question, answer
    }
  });

  res.json(updatedQuestion);
});

// DELETE /questions/:questionId
// Delete a question
router.delete("/:questionId", async (req, res) => {
  const questionId = Number(req.params.questionId);

   const question = await prisma.question.findUnique({
    where: { id: questionId }
  });

  if (!question) {
    return res.status(404).json({ message: "question not found" });
  }

  await prisma.question.delete({ where: { id: questionId} });

  res.json({
    message: "Question deleted successfully",
    question: question
  });
});
module.exports = router;