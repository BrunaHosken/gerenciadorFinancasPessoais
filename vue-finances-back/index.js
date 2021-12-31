const { prisma } = require("./generated/prisma-client");

async function main() {
  await prisma.createUser({
    name: "Bruna Hosken",
    email: "bruna16.hosken@gmail.com",
    password: "abc123",
  });
  const users = await prisma.users();
  console.log("Users:", users);
}

main().catch((e) => console.error(e));
