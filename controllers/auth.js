const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sequelize = require("../config/db");
const User = require("../models/user");

//  generate tokern fucntion
const generateToken = (user) => {
  const payload = {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
};

//  auth controller functions
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

// login function
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  const checkUserExists = await User.findOne({ where: { username } });
  if (checkUserExists === null) {
    return res.status(401).json({ error: "User does not exist" });
  }
  const isValidPassword = await bcrypt.compare(
    password,
    checkUserExists.password
  );
  if (!isValidPassword) {
    return res.status(401).json({ error: "Wrong Password" });
  } else {
    const token = generateToken(checkUserExists);
    return res
      .status(200)
      .json({ message: "User Login Success", token: token });
  }
};
module.exports = {
  registerUser,
  loginUser,
};
