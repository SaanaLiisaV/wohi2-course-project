const prisma = require("../lib/prisma");

async function isOwner (req, res, next) {

    // Looks up the question by ID from the URL parameter
    // api/questions/:questionId
    const id = Number(req.params.questionId);
    const question = await prisma.question.findUnique({
      where: { id },
    });

    // Returns 404 if the question doesn’t exist
    if (!prisma.question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Compares question.userId with req.user.userId (set by the authenticate middleware (auth.js)) 
    // returns 403 if they don’t match
    if (question.userId !== req.user.userId) {
      //If the owner of the question is not the user that is authenticated
      return res.status(403).json({ error: "You can only modify your own questions" });
    }

    // Attach the record to the request so the route handler can reuse it
    req.question = question;
    next();
  
}

module.exports = isOwner;