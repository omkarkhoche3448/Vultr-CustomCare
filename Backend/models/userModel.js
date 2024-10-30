const bcrypt = require('bcryptjs');

class User {
  constructor(id, username, email, password, role) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  static async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  async isValidPassword(inputPassword) {
    return await bcrypt.compare(inputPassword, this.password);
  }
}

// Simulated in-memory storage for demonstration
const users = [];
let userIdCounter = 1;

const createUser = async (username, email, password, role) => {
  const hashedPassword = await User.hashPassword(password);
  const newUser = new User(userIdCounter++, username, email, hashedPassword, role);
  users.push(newUser);
  return newUser;
};

const findUserByEmail = (email) => users.find(user => user.email === email);

module.exports = {
  User,
  createUser,
  findUserByEmail,
};
