const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/crm';

async function createInitialAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      console.log('Admin user already exists:');
      console.log(`Email: ${existingAdmin.email}`);
      console.log(`Name: ${existingAdmin.name}`);
      console.log('No new admin created.');
      return;
    }

    // Create initial admin user
    const adminEmail = process.env.INITIAL_ADMIN_EMAIL || 'admin@prodify.com';
    const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || 'admin123';
    const adminName = process.env.INITIAL_ADMIN_NAME || 'System Administrator';

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    // Create admin user
    const adminUser = new User({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: 'admin'
    });

    await adminUser.save();

    console.log('Initial admin user created successfully!');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('Name:', adminName);
    console.log('');
    console.log('IMPORTANT: Please change the admin password after first login for security reasons.');
    console.log('You can set custom admin credentials by adding these environment variables:');
    console.log('   - INITIAL_ADMIN_EMAIL');
    console.log('   - INITIAL_ADMIN_PASSWORD'); 
    console.log('   - INITIAL_ADMIN_NAME');

  } catch (error) {
    console.error('Error creating initial admin:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
}

// Run the function
createInitialAdmin();
