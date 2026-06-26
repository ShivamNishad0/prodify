const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
  process.env.PGDATABASE || 'prodify_crm',
  process.env.PGUSER || 'shivam',
  process.env.PGPASSWORD || '',
  {
    host: process.env.PGHOST || 'localhost',
    port: process.env.PGPORT || 5432,
    dialect: 'postgres',
    logging: false, // Set to console.log to debug SQL queries
    define: {
      timestamps: true, // Auto-create createdAt and updatedAt
    }
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL successfully connected');
    
    // Import all models to ensure they register before syncing
    require('../models/User');
    require('../models/Customer');
    require('../models/Product');
    require('../models/Order');
    require('../models/Inventory');
    require('../models/Message');
    require('../models/Note');
    require('../models/Notification');
    require('../models/Tasks');
    require('../models/Tender');

    // Sync all models (use alter: true for development)
    await sequelize.sync({ alter: true });
    console.log('PostgreSQL models synced successfully');
  } catch (err) {
    console.error(`PostgreSQL connection error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  connectDB
};
