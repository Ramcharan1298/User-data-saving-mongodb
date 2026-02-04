const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- Database Connection (Cached) ---
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongoose) => {
      console.log('New MongoDB Connection Established');
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};

// --- Mongoose Schema ---
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  fatherName: { type: String, trim: true },
  occupation: { type: String, trim: true },
  college: { type: String, trim: true },
  address: { type: String, trim: true }
}, {
  timestamps: true
});

// Check if model exists before compiling to avoid OverwriteModelError in Serverless
const User = mongoose.models.User || mongoose.model('User', userSchema);

// --- Routes ---

// Health Check
app.get('/api', (req, res) => {
    res.send('API is running...');
});

// Create User
app.post('/api/users', async (req, res) => {
  await connectDB();
  try {
    const { name, email, fatherName, occupation, college, address } = req.body;
    
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
      address
    });

    res.status(201).json(user);
  } catch (error) {
    console.error('Error in Create User:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Get All Users
app.get('/api/users', async (req, res) => {
  await connectDB();
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Error in Get Users:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Update User
app.put('/api/users/:id', async (req, res) => {
  await connectDB();
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
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error in Update User:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Delete User
app.delete('/api/users/:id', async (req, res) => {
  await connectDB();
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      await user.deleteOne();
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error in Delete User:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = app;
