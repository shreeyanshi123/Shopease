const User = require('../../models/User');
const bcrypt = require('bcryptjs');

// Add a new admin
exports.addAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }
    // Create new admin
    const hashedPassword = await bcrypt.hash(password, 10);
    const userName = email.split('@')[0];
    const newAdmin = new User({
      userName,
      email,
      password: hashedPassword,
      role: 'admin',
    });
    await newAdmin.save();
    res.status(201).json({ message: 'Admin created successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
};
