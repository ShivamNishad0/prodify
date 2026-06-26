const { sequelize } = require('./config/db');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

// Load environment variables
dotenv.config();

async function createInitialAdmin() {
  try {
    // Authenticate and connect
    await sequelize.authenticate();
    console.log('Connected to PostgreSQL database');

    // Sync database schemas to ensure User table exists
    await sequelize.sync({ alter: true });
    console.log('PostgreSQL models synced successfully');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ where: { role: 'admin' } });
    
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
    const adminUser = await User.create({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: 'admin'
    });

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
    await sequelize.close();
    console.log('Database connection closed.');
  }
}

// Run the function
createInitialAdmin();
