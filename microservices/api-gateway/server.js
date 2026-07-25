const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true,
}));

// Proxy to Auth Service (Port 5001)
app.use('/api/auth', createProxyMiddleware({ target: 'http://localhost:5001', changeOrigin: true }));
app.use('/api/admin', createProxyMiddleware({ target: 'http://localhost:5001', changeOrigin: true }));
app.use('/api/keycloak', createProxyMiddleware({ target: 'http://localhost:5001', changeOrigin: true }));

// Proxy to CRM Core Service (Port 5002)
app.use('/api/customers', createProxyMiddleware({ target: 'http://localhost:5002', changeOrigin: true }));
app.use('/api/products', createProxyMiddleware({ target: 'http://localhost:5002', changeOrigin: true }));
app.use('/api/orders', createProxyMiddleware({ target: 'http://localhost:5002', changeOrigin: true }));
app.use('/api/inventory', createProxyMiddleware({ target: 'http://localhost:5002', changeOrigin: true }));
app.use('/api/tenders', createProxyMiddleware({ target: 'http://localhost:5002', changeOrigin: true }));

// Proxy to Communications & Analytics Service (Port 5003)
app.use('/api/analytics', createProxyMiddleware({ target: 'http://localhost:5003', changeOrigin: true }));
app.use('/api/notifications', createProxyMiddleware({ target: 'http://localhost:5003', changeOrigin: true }));
app.use('/api/messages', createProxyMiddleware({ target: 'http://localhost:5003', changeOrigin: true }));
app.use('/api/notes', createProxyMiddleware({ target: 'http://localhost:5003', changeOrigin: true }));
app.use('/api/tasks', createProxyMiddleware({ target: 'http://localhost:5003', changeOrigin: true }));

// Proxy to HRMS Service (Port 8181)
app.use('/api/hrms', createProxyMiddleware({ target: 'http://localhost:8181', changeOrigin: true, pathRewrite: { '^/api/hrms': '/api' } }));

app.get('/', (req, res) => {
  res.json({ message: 'Prodify API Gateway is running' });
});

app.listen(PORT, () => {
  console.log(`API Gateway listening on port ${PORT}`);
});
