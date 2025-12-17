import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const OrderStatusChart = ({ data, height = 300 }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#64748b',
          font: {
            size: 12,
            family: 'Inter, sans-serif'
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      title: {
        display: true,
        text: 'Order Status Distribution',
        color: '#1e293b',
        font: {
          size: 16,
          weight: 'bold',
          family: 'Inter, sans-serif'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#3cb2a8',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%',
    elements: {
      arc: {
        borderWidth: 2,
        borderColor: '#ffffff'
      }
    }
  };


  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Order Analytics</h3>
            <p className="text-gray-600">Current order status distribution</p>
          </div>
          <div className="flex space-x-2">
            <div className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
              192 Orders
            </div>
            <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              Active
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4">
        <div style={{ height: `${height}px` }}>
          <Doughnut data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default OrderStatusChart;
