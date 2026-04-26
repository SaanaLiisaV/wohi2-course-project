const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
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
  await prisma.user.deleteMany();


  // Create a default user
  const hashedPassword = await bcrypt.hash("1234", 10);
  const user = await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: hashedPassword,
      name: "Admin User",
    },
  });

  console.log("Created user:", user.email);


  for (const question of seedQuestions) {
    await prisma.question.create({
      data: {
        question: question.question,
        answer: question.answer,
         userId: user.id,
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

