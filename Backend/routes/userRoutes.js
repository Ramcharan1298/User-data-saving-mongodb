const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
router.post('/users', async (req, res) => {
  try {
    const { name, email, fatherName, occupation, college, address } = req.body;

    // Validation (basic loop for required fields) - Mongoose also handles this but good to have explicit checks if needed
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and Email are required' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      fatherName,
      occupation,
      college,
      address,
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        message: 'User registered successfully!',
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Public
router.get('/users', async (req, res) => {
  try {
    console.log('GET /api/users called');
    const users = await User.find({}).sort({ createdAt: -1 }); // Newest first
    console.log(`Found ${users.length} users`);
    res.json(users);
  } catch (error) {
    console.error('Error in GET /api/users:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Public
router.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.fatherName = req.body.fatherName || user.fatherName;
      user.occupation = req.body.occupation || user.occupation;
      user.college = req.body.college || user.college;
      user.address = req.body.address || user.address;

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        message: 'User updated successfully!',
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Public
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      await user.deleteOne();
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
