const { User, Role } = require('../models');
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
  try {
    const { username, email, password, roleId } = req.body;
    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email and password are required' });
    }

    // const hashedPassword = await bcrypt.hash(password, 10);
    // Default to roleId 6 (User) if not provided
    // This logic might need adjustment based on exact requirements/Role seeding
    const userRole = roleId || 6;

    const newUser = await User.create({
      username,
      email,
      password: password, // Model hooks will hash this
      RoleId: userRole
    });

    res.status(201).json({ message: 'User created successfully', user: { id: newUser.id, username: newUser.username, email: newUser.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      include: 'Role'
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, getAllUsers, getRoles };