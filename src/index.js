const express = require("express");
const app = express();
const prisma = require("./lib/prisma");

const questionsRouter = require("./routes/questions"); 
// Middleware to parse JSON bodies
app.use(express.json());
// everything under /api/questions
app.use("/api/questions", questionsRouter);

app.use((req, res) => {
  res.json({msg: "Not found"});
});
//kokeilu
app.listen(3000, () => {
  console.log("Server running on port 3000");
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

