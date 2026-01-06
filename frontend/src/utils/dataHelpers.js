// Data formatting and calculation utilities for CRM Dashboard

// Format currency with proper locale formatting
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format large numbers with K, M suffixes
export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// Calculate percentage change
export const calculatePercentageChange = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

// Generate mock data for charts (replace with real API calls later)
export const generateRevenueData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return {
    labels: months,
    datasets: [{
      label: 'Revenue',
      data: [12000, 19000, 15000, 25000, 22000, 30000, 28000, 35000, 32000, 40000, 38000, 42000],
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.4
    }]
  };
};

export const generateCustomerData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return {
    labels: months,
    datasets: [{
      label: 'New Customers',
      data: [45, 67, 52, 78, 65, 89, 76, 94, 87, 102, 98, 115],
      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 205, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 159, 64, 0.8)',
        'rgba(199, 199, 199, 0.8)',
        'rgba(83, 102, 255, 0.8)',
        'rgba(255, 99, 255, 0.8)',
        'rgba(99, 255, 132, 0.8)',
        'rgba(255, 205, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
      ],
    }]
  };
};

export const generateOrderStatusData = () => {
  return {
    labels: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    datasets: [{
      data: [30, 45, 25, 80, 12],
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF'
      ],
      hoverOffset: 4
    }]
  };
};

export const generateSalesByCategoryData = () => {
  return {
    labels: ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books'],
    datasets: [{
      data: [35000, 28000, 22000, 18000, 12000],
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF'
      ],
    }]
  };
};

// Mock data for dashboard metrics
export const getDashboardMetrics = () => {
  return {
    totalCustomers: 1247,
    activeCustomers: 892,
    newCustomers: 156,
    revenueThisMonth: 45780,
    revenueChange: 12.5,
    customerChange: 8.3,
    orderChange: -2.1,
    conversionRate: 3.2
  };
};

// Mock data for recent activities
export const getRecentActivities = () => {
  return [
    {
      id: 1,
      type: 'order',
      title: 'New Order #1234',
      description: 'John Doe placed an order worth $299.99',
      timestamp: '2 minutes ago',
      icon: 'ShoppingCart'
    },
    {
      id: 2,
      type: 'customer',
      title: 'New Customer',
      description: 'Sarah Wilson registered as a new customer',
      timestamp: '15 minutes ago',
      icon: 'UserPlus'
    },
    {
      id: 3,
      type: 'product',
      title: 'Product Update',
      description: 'iPhone 15 Pro stock updated to 50 units',
      timestamp: '1 hour ago',
      icon: 'Package'
    },
    {
      id: 4,
      type: 'message',
      title: 'Customer Message',
      description: 'New support message from Mike Johnson',
      timestamp: '2 hours ago',
      icon: 'MessageSquare'
    },
    {
      id: 5,
      type: 'order',
      title: 'Order Shipped',
      description: 'Order #1230 has been shipped to customer',
      timestamp: '3 hours ago',
      icon: 'Truck'
    }
  ];
};

// Mock data for quick actions
export const getQuickActions = () => {
  return [
    {
      id: 'add-customer',
      title: 'Add Customer',
      description: 'Create new customer profile',
      icon: 'UserPlus',
      color: '#4CAF50'
    },
    {
      id: 'create-order',
      title: 'Create Order',
      description: 'Start new order process',
      icon: 'ShoppingCart',
      color: '#2196F3'
    },
    {
      id: 'add-product',
      title: 'Add Product',
      description: 'Add new product to inventory',
      icon: 'Package',
      color: '#FF9800'
    },
    {
      id: 'send-message',
      title: 'Send Message',
      description: 'Contact customer via email',
      icon: 'Mail',
      color: '#9C27B0'
    }
  ];
};

// Mock data for top performers
export const getTopPerformers = () => {
  return {
    topCustomers: [
      { name: 'ABC Corp', orders: 45, revenue: 125000 },
      { name: 'XYZ Ltd', orders: 38, revenue: 98000 },
      { name: 'Tech Solutions', orders: 32, revenue: 87000 }
    ],
    topProducts: [
      { name: 'iPhone 15 Pro', sales: 156, revenue: 156000 },
      { name: 'MacBook Air', sales: 89, revenue: 107000 },
      { name: 'iPad Pro', sales: 67, revenue: 67000 }
    ]
  };
};
