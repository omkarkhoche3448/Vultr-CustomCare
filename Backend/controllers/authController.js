const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('../models/userModel');
require('dotenv').config();

const signup = async (req, res) => {
  const { username, email, password, role } = req.body;
  
  if (!username || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (findUserByEmail(email)) {
    return res.status(400).json({ message: "User already exists" });
  }

  const newUser = await createUser(username, email, password, role);
  res.status(201).json({ message: "User created successfully", userId: newUser.id });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = findUserByEmail(email);
  if (!user || !(await user.isValidPassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.status(200).json({ token });
};

module.exports = { signup, login };
