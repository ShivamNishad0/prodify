// server.js (or index.js)

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// --- 1. CONFIGURATION LOADING ---
dotenv.config();

// --- 2. EXPRESS INITIALIZATION ---
const app = express();

const PORT = 5001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/crm';

// The frontend origins that are allowed access (including the reported 5173)
const ALLOWED_ORIGINS = process.env.CORS_ORIGINS ? 
                        process.env.CORS_ORIGINS.split(',') : 
                        ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'];


// --- 4. DATABASE CONNECTION ---
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB successfully connected');
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    // Exit process with failure code 1
    process.exit(1); 
  }
};

// --- 5. MIDDLEWARE ---
app.use(cors({
  origin: ALLOWED_ORIGINS, // Whitelist of frontend origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// B. Express JSON Parser
app.use(express.json());

// --- 6. ROUTES ---
// Mount modular routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));

app.use('/api/inventory', require('./routes/inventory'));


app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/notifications', require('./routes/notifications'));

app.use('/api/messages', require('./routes/messages'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/tenders', require('./routes/tenders'));

// Basic health check route
app.get('/', (req, res) => {
  res.status(200).json({ status: 'API is running', service: 'CRM Backend' });
});


// --- 7. SERVER STARTUP ---
// Connect to DB, then start the server
connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
});