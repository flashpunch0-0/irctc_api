const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sequelize = require("../config/db");
const User = require("../models/user");

const registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!["admin", "user"].includes(role)) {
    return res.status(400).json({ error: "Role Does Not Match" });
  }
  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const checkUsernameExist = await User.findOne({
    where: { username },
  });
  if (checkUsernameExist) {
    return res.status(400).json({ error: "Username already exists" });
  }

  const checkEmailExist = await User.findOne({
    where: { email },
  });
  if (checkEmailExist) {
    return res.status(400).json({ error: "Email already exists" });
  }

  //  hashing password to store in db
  const salt = await bcrypt.genSalt(10);
  let hashedPassword = await bcrypt.hash(password, salt);

  User.create({
    username: username,
    email: email,
    password: hashedPassword,
    role: role,
  });
  res.status(201).json({ message: `${username} created successfully` });
};

module.exports = {
  registerUser,
};
