
require('dotenv').config();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');


// Signup function
const signup = async (req, res) => {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await userModel.getUser(email);
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password and save the user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { name, email, password: hashedPassword, role };
    
    try {
        await userModel.saveUser(newUser);
        res.status(201).json({ message: 'User signed up successfully' });
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).json({ message: 'Error saving user' });
    }
};

// Login function
const login = async (req, res) => {
  const { email, password } = req.body;

  // Retrieve user from Vultr storage
  const user = await userModel.getUser(email);
  if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
  }

  // Compare password
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
  }

  // controllers/authController.js - During JWT generation in login function
  const token = jwt.sign({ email: user.email, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.status(200).json({ message: 'Login successful', token });
};


const signupRepresentative = async (req, res) => {
    const { name, email, password, operations } = req.body;
    const role = 'Representative';
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { name, email, password: hashedPassword, role, operations };
    
    await userModel.saveUser(newUser);
    res.status(201).json({ message: 'Representative signed up successfully' });
};

// Original signup function for Admin signup remains unchanged
module.exports = { signup, login, signupRepresentative };
