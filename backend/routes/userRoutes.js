import express from 'express';
import { User } from '../models.js'
import authenticateJWT from '../middlewares/auth.js';

const userRoutes = express.Router();

// GET all users
userRoutes.get('/', authenticateJWT, async (req, res) => {
  const { role } = req.user;

  // if user is a student
  if (role === 'student' || role === 'teacher') {
    return res.status(403).json({ message: 'You are not allowed to check on users' });
  }
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET all students so we can list them in the form in front-end
userRoutes.get('/students', authenticateJWT, async (req, res) => {
  const { role } = req.user;

  if (role === 'student') {
    return res.status(403).json({ message: 'You are not allowed to check on this action' });
  }
  try {
    const students = await User.findAll({
      where: { role: 'student' },
      attributes: ['id', 'username']
    });
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// GET user by ID
userRoutes.get('/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { role } = req.user;

  if (role === 'student') {
    return res.status(403).json({ message: 'You are not allowed to use this action' });
  }

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// CREATE a new user
userRoutes.post('/', authenticateJWT, async (req, res) => {
  const { username, role, password } = req.body;
  const user_role = req.user.role;

  if (user_role === 'student') {
    return res.status(403).json({ message: 'Students are not allowed to use this action' });
  }
  
  if (!['student', 'teacher', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role. Role must be one of: student, teacher, admin' });
  }
  
  try {
    const newUser = await User.create({
      username,
      role,
      password,
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// UPDATE user by ID
userRoutes.put('/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;
  const { role } = req.user;

  if (role === 'student') {
    return res.status(403).json({ message: 'You are not allowed to use this action' });
  }

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await user.update({
      username,
      email,
      password, // Remember to hash passwords in production
    });
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE user by ID
userRoutes.delete('/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { role } = req.user;

  if (role === 'student') {
    return res.status(403).json({ message: 'You are not allowed to use this action' });
  }
  
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default userRoutes;
