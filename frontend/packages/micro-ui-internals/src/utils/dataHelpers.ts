// Data formatting and calculation utilities for CRM Dashboard

// Format currency with proper locale formatting
export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

// Format large numbers with K, M suffixes
export const formatNumber = (num: number) => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
};

// Calculate percentage change
export const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
};

// Generate mock data for charts
export const generateRevenueData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return {
        labels: months,
        datasets: [{
            label: 'Revenue',
            data: [12000, 19000, 15000, 25000, 22000, 30000, 28000, 35000, 32000, 40000, 38000, 42000],
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.4,
            fill: true,
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
            backgroundColor: 'rgba(139, 69, 19, 0.8)',
            borderColor: 'rgba(139, 69, 19, 1)',
            borderWidth: 1,
        }]
    };
};

export const generateOrderStatusData = () => {
    return {
        labels: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        datasets: [{
            label: 'Orders',
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
            label: 'Sales',
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
