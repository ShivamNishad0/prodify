const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/crm';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected for seeding');
  } catch (err) {
    console.error(`❌ MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

const Customer = require('./Customer');

const seedCustomers = async () => {
  try {
    await connectDB();
    await Customer.deleteMany({});
    
    const customers = [
      {
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1-555-0101',
        address: {
          street: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        },
        status: 'active'
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1-555-0102',
        address: {
          street: '456 Oak Avenue',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210',
          country: 'USA'
        },
        status: 'active'
      },
      {
        name: 'Michael Brown',
        email: 'michael.brown@email.com',
        phone: '+1-555-0103',
        address: {
          street: '789 Pine Street',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          country: 'USA'
        },
        status: 'inactive'
      },
      {
        name: 'Emily Davis',
        email: 'emily.davis@email.com',
        phone: '+1-555-0104',
        address: {
          street: '321 Elm Street',
          city: 'Houston',
          state: 'TX',
          zipCode: '77001',
          country: 'USA'
        },
        status: 'active'
      },
      {
        name: 'David Wilson',
        email: 'david.wilson@email.com',
        phone: '+1-555-0105',
        address: {
          street: '654 Maple Drive',
          city: 'Phoenix',
          state: 'AZ',
          zipCode: '85001',
          country: 'USA'
        },
        status: 'prospect'
      },
      {
        name: 'Jessica Martinez',
        email: 'jessica.martinez@email.com',
        phone: '+1-555-0106',
        address: {
          street: '987 Cedar Lane',
          city: 'Philadelphia',
          state: 'PA',
          zipCode: '19101',
          country: 'USA'
        },
        status: 'active'
      },
      {
        name: 'Robert Taylor',
        email: 'robert.taylor@email.com',
        phone: '+1-555-0107',
        address: {
          street: '147 Birch Street',
          city: 'San Antonio',
          state: 'TX',
          zipCode: '78201',
          country: 'USA'
        },
        status: 'inactive'
      },
      {
        name: 'Jennifer Garcia',
        email: 'jennifer.garcia@email.com',
        phone: '+1-555-0108',
        address: {
          street: '258 Spruce Avenue',
          city: 'San Diego',
          state: 'CA',
          zipCode: '92101',
          country: 'USA'
        },
        status: 'active'
      }
    ];

    await Customer.insertMany(customers);
    console.log('✅ Customers seeded successfully');
    
    return customers;
  } catch (error) {
    console.error('❌ Error seeding customers:', error);
    throw error;
  }
};

module.exports = seedCustomers;

