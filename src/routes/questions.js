const express = require("express");
const router = express.Router();
const prisma = require("../lib/prisma");
const authenticate = require("../middleware/auth");
const isOwner = require("../middleware/isOwner");


router.use(authenticate); // Apply authentication to all routes in this router

// GET /questions
// List all questions
router.get("/", async (req, res) => {
    
    const questions = await prisma.question.findMany({
    orderBy: { id: "asc" },
  });

  res.json(questions);
});

// GET /questions/:questionId
// Show a specific question -> GET api/questions/3
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
      question, answer,
      userId: req.user.userId,
    },
  });

  res.status(201).json(newQuestion);
});

// PUT /questions/:questionId - Edit a question
// isOwner checks existence and ownership

router.put("/:questionId", isOwner, async (req, res) => {

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

// DELETE /questions/:questionId - Delete a question
// isOwner checks existence and ownership
router.delete("/:questionId", isOwner, async (req, res) => {
  const questionId = Number(req.params.questionId);

   const question = await prisma.question.findUnique({
    where: { id: questionId }
  });

  if (!question) {
    return res.status(404).json({ message: "Question not found" });
  }

  await prisma.question.delete({ where: { id: questionId} });

  res.json({
    message: "Question deleted successfully",
    question: question
  });
});
module.exports = router;