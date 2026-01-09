const express = require('express');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const adminAuth = require('../middleware/adminAuth');
const User = require('../models/User');

const router = express.Router();

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

// Function to send welcome email with credentials
const sendWelcomeEmail = async (email, name, tempPassword) => {
  const loginUrl = `${process.env.FRONTEND_URL}/login`;
  
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Welcome to prodify CRM - Your Account Details',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #3cb2a8; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1>Welcome to prodify CRM!</h1>
        </div>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px;">
          <p>Hello, ${name}</p>
          <p>Your admin has created an account for you in the prodify CRM system.</p>
          <p>Here are your login credentials:</p>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #ddd;">
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Temporary Password:</strong> ${tempPassword}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${loginUrl}" style="background-color: #3cb2a8; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Login to Your Account
            </a>
          </div>
          
          <p><strong>Important:</strong> Please change your password after your first login for security reasons.</p>
          
          <p>Best regards,<br>The prodify CRM Team</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully');
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

// Generate temporary password
const generateTempPassword = () => {
  return crypto.randomBytes(8).toString('hex');
};

// @route   GET /api/admin/users
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/admin/create-user
// @desc    Create new user (Admin only)
// @access  Private/Admin
router.post('/create-user', adminAuth, async (req, res) => {
  try {
    const { name, email, role = 'user', sendEmail = true } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User with this email already exists' });
    }

    // Generate temporary password
    const tempPassword = generateTempPassword();

    // Create new user
    user = new User({
      name,
      email,
      password: tempPassword,
      role: role || 'employee' // Use provided role or default to 'employee'
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(tempPassword, salt);

    await user.save();

    // Send welcome email if requested
    if (sendEmail) {
      try {
        await sendWelcomeEmail(email, name, tempPassword);
        return res.status(201).json({
          msg: 'User created successfully and welcome email sent',
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
          }
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // User was created but email failed
        return res.status(201).json({
          msg: 'User created successfully but welcome email failed to send',
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
          },
          emailError: 'Failed to send welcome email'
        });
      }
    }

    res.status(201).json({
      msg: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/admin/users/:id
// @desc    Update user (Admin only)
// @access  Private/Admin
router.put('/users/:id', adminAuth, async (req, res) => {
  try {
    const { name, email, role } = req.body;

    // Find user to update
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ msg: 'Email already in use by another user' });
      }
    }

    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;

    await user.save();

    res.json({
      msg: 'User updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user (Admin only)
// @access  Private/Admin
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Prevent admin from deleting themselves
    if (user.id === req.user.id) {
      return res.status(400).json({ msg: 'Cannot delete your own account' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ msg: 'User deleted successfully' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/admin/reset-user-password/:id
// @desc    Reset user password (Admin only)
// @access  Private/Admin
router.post('/reset-user-password/:id', adminAuth, async (req, res) => {
  try {
    const { sendEmail = true } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Generate new temporary password
    const newTempPassword = generateTempPassword();

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newTempPassword, salt);
    await user.save();

    // Send password reset email if requested
    if (sendEmail) {
      try {
        await sendWelcomeEmail(user.email, user.name, newTempPassword);
        return res.json({
          msg: 'Password reset successfully and email sent to user',
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        return res.json({
          msg: 'Password reset successfully but email failed to send',
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          },
          emailError: 'Failed to send password reset email'
        });
      }
    }

    res.json({
      msg: 'Password reset successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
