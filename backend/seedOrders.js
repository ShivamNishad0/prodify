const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/crm';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected for seeding');
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

const Order = require('./Order');
const Customer = require('./Customer');
const Product = require('./Product');

const seedOrders = async () => {
  try {
    await connectDB();
    await Order.deleteMany({});
    
    // Get customers for order creation
    const customers = await Customer.find();
    const products = await Product.find();
    
    if (customers.length === 0) {
      console.log('No customers found. Please seed customers first.');
      return;
    }
    
    if (products.length === 0) {
      console.log('No products found. Please seed products first.');
      return;
    }

    const orders = [
      {
        customer: customers[0]._id, // John Smith
        items: [
          { product: products[0]._id, quantity: 2, price: 99.99 },
          { product: products[1]._id, quantity: 1, price: 149.99 }
        ],
        totalAmount: 349.97,
        status: 'delivered',
        orderDate: new Date('2024-01-15'),
        shippingAddress: {
          street: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        }
      },
      {
        customer: customers[0]._id, // John Smith
        items: [
          { product: products[2]._id, quantity: 1, price: 299.99 }
        ],
        totalAmount: 299.99,
        status: 'delivered',
        orderDate: new Date('2024-02-20'),
        shippingAddress: {
          street: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        }
      },
      {
        customer: customers[1]._id, // Sarah Johnson
        items: [
          { product: products[1]._id, quantity: 3, price: 149.99 },
          { product: products[3]._id, quantity: 2, price: 79.99 }
        ],
        totalAmount: 629.95,
        status: 'delivered',
        orderDate: new Date('2024-01-25'),
        shippingAddress: {
          street: '456 Oak Avenue',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210',
          country: 'USA'
        }
      },
      {
        customer: customers[1]._id, // Sarah Johnson
        items: [
          { product: products[4]._id, quantity: 1, price: 199.99 }
        ],
        totalAmount: 199.99,
        status: 'processing',
        orderDate: new Date('2024-03-10'),
        shippingAddress: {
          street: '456 Oak Avenue',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210',
          country: 'USA'
        }
      },
      {
        customer: customers[2]._id, // Michael Brown
        items: [
          { product: products[0]._id, quantity: 1, price: 99.99 },
          { product: products[2]._id, quantity: 1, price: 299.99 }
        ],
        totalAmount: 399.98,
        status: 'delivered',
        orderDate: new Date('2023-12-05'),
        shippingAddress: {
          street: '789 Pine Street',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          country: 'USA'
        }
      },
      {
        customer: customers[3]._id, // Emily Davis
        items: [
          { product: products[1]._id, quantity: 2, price: 149.99 },
          { product: products[4]._id, quantity: 1, price: 199.99 },
          { product: products[3]._id, quantity: 1, price: 79.99 }
        ],
        totalAmount: 579.96,
        status: 'delivered',
        orderDate: new Date('2024-02-14'),
        shippingAddress: {
          street: '321 Elm Street',
          city: 'Houston',
          state: 'TX',
          zipCode: '77001',
          country: 'USA'
        }
      },
      {
        customer: customers[4]._id, // David Wilson (Prospect)
        items: [
          { product: products[2]._id, quantity: 1, price: 299.99 }
        ],
        totalAmount: 299.99,
        status: 'pending',
        orderDate: new Date('2024-03-20'),
        shippingAddress: {
          street: '654 Maple Drive',
          city: 'Phoenix',
          state: 'AZ',
          zipCode: '85001',
          country: 'USA'
        }
      },
      {
        customer: customers[5]._id, // Jessica Martinez
        items: [
          { product: products[0]._id, quantity: 4, price: 99.99 },
          { product: products[3]._id, quantity: 3, price: 79.99 }
        ],
        totalAmount: 659.93,
        status: 'delivered',
        orderDate: new Date('2024-01-30'),
        shippingAddress: {
          street: '987 Cedar Lane',
          city: 'Philadelphia',
          state: 'PA',
          zipCode: '19101',
          country: 'USA'
        }
      },
      {
        customer: customers[6]._id, // Robert Taylor
        items: [
          { product: products[1]._id, quantity: 1, price: 149.99 }
        ],
        totalAmount: 149.99,
        status: 'cancelled',
        orderDate: new Date('2024-02-05'),
        shippingAddress: {
          street: '147 Birch Street',
          city: 'San Antonio',
          state: 'TX',
          zipCode: '78201',
          country: 'USA'
        }
      },
      {
        customer: customers[7]._id, // Jennifer Garcia
        items: [
          { product: products[4]._id, quantity: 2, price: 199.99 },
          { product: products[2]._id, quantity: 1, price: 299.99 }
        ],
        totalAmount: 699.97,
        status: 'shipped',
        orderDate: new Date('2024-03-05'),
        shippingAddress: {
          street: '258 Spruce Avenue',
          city: 'San Diego',
          state: 'CA',
          zipCode: '92101',
          country: 'USA'
        }
      }
    ];

    await Order.insertMany(orders);
    console.log('Orders seeded successfully');
    
    return orders;
  } catch (error) {
    console.error('Error seeding orders:', error);
    throw error;
  }
};

module.exports = seedOrders;

