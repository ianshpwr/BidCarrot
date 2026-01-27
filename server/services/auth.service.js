const prisma = require("../utils/prisma.util.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = async ({ name, email, password }) => {
  const hashed = await bcrypt.hash(password, 10);
  email = email.toLowerCase();

  const user = await prisma.user.create({
    data: { name, email, password: hashed }
  });

  return { message: "Signup successful", user };
};

exports.login = async ({ email, password }) => {
  email = email.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { error: "User not found" };

  const match = await bcrypt.compare(password, user.password);
  if (!match) return { error: "Invalid password" };

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  
  // Exclude password
  const { password: _, ...userWithoutPassword } = user;

  return { message: "Login successful", token, user: userWithoutPassword };
};
