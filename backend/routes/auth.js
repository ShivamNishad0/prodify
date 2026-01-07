const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');

const router = express.Router();

// Configure multer for avatar uploads
const avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/avatars');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const avatarUpload = multer({
  storage: avatarStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});


// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Function to send password reset email
const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  const user = await User.findOne({ email });
  const name = user.name;
  
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Password Reset Request - prodify CRM',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #3cb2a8; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1>Password Reset Request</h1>
        </div>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px;">
          <p>Hello, ${name}</p>
          <p>You have requested to reset your password for your prodify CRM account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #3cb2a8; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>This link will expire in 10 minutes for security reasons.</p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <p>Best regards,<br>The prodify CRM Team</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully');
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

// Register user - RESTRICTED TO ADMIN ONLY
router.post('/register', async (req, res) => {
  return res.status(403).json({ 
    msg: 'Public registration is disabled. Please contact an administrator to create your account.' 
  });
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }


    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create JWT token
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');

  }
});

// Forgot password - send reset email
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal whether email exists or not for security
      return res.status(200).json({ 
        msg: 'If an account with that email exists, we have sent a password reset link.' 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 600000); // 10 minutes from now

    // Save reset token and expiry to user
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Send reset email
    await sendPasswordResetEmail(email, resetToken);

    res.status(200).json({ 
      msg: 'If an account with that email exists, we have sent a password reset link.' 
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Reset password - validate token and update password
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Find user with valid reset token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid or expired reset token' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    // Clear reset token and expiry
    user.resetToken = null;
    user.resetTokenExpiry = null;
    
    await user.save();

    res.status(200).json({ msg: 'Password reset successful' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Verify token
router.get('/verify', async (req, res) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from token
    const user = await User.findById(decoded.user.id).select('-password');
    if (!user) {
      return res.status(401).json({ msg: 'Token is not valid' });
    }

    res.json({ user });
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
});

// Get current user profile
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const {
      name,
      phone,
      address,
      city,
      country,
      bio,
      dateOfBirth,
      gender,
      company,
      website,
      socialMedia
    } = req.body;

    const updateData = {
      name,
      phone,
      address,
      city,
      country,
      bio,
      dateOfBirth,
      gender,
      company,
      website,
      socialMedia
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );

    const user = await User.findByIdAndUpdate(
      decoded.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: err.message });
    }
    res.status(500).send('Server error');
  }
});

// Update user avatar
router.put('/avatar', avatarUpload.single('avatar'), async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!req.file) {
      return res.status(400).json({ msg: 'Please upload an image' });
    }

    // Delete old avatar if exists
    const oldUser = await User.findById(decoded.user.id);
    if (oldUser && oldUser.avatar) {
      const oldAvatarPath = path.join(__dirname, '..', oldUser.avatar);
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    const user = await User.findByIdAndUpdate(
      decoded.user.id,
      { avatar: `/uploads/avatars/${req.file.filename}` },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Change password
router.put('/password', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(decoded.user.id);

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    await user.save();

    res.json({ msg: 'Password updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
