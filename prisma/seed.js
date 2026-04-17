const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const seedQuestions = [
  {
    id: 1,
    question: "What is the descriptive name of Iceland?",
    answer: "The Land of Ice and Fire"
  },
  {
    id: 2,
    question: "What is the natural source of red dye?",
    answer: "Cochineal insects"
  },
  {
    id: 3,
    question: "What planet is closest to the sun?",
    answer: "Mercury"
  },
  {
    id: 4,
    question: "Who painted the ceiling of the Sistine Chapel?",
    answer: "Michelangelo"
  }
];

async function main() {
  await prisma.question.deleteMany();

  for (const question of seedQuestions) {
    await prisma.question.create({
      data: {
        question: question.question,
        answer: question.answer,
      },
    });
  }

  console.log("Seed data inserted successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

