import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CustomerChart = ({ data, height = 300 }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#64748b',
          font: {
            size: 12,
            family: 'Inter, sans-serif'
          }
        }
      },
      title: {
        display: true,
        text: 'Customer Acquisition (Monthly)',
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
            return `New Customers: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 11
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(100, 116, 139, 0.1)'
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 11
          },
          callback: function(value) {
            return value;
          }
        }
      }
    },
    elements: {
      bar: {
        borderRadius: 4,
        borderSkipped: false,
      }
    }
  };


  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Customer Growth</h3>
            <p className="text-gray-600">Monthly customer acquisition trends</p>
          </div>
          <div className="flex space-x-2">
            <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              156 New
            </div>
            <div className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
              Growth
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4">
        <div style={{ height: `${height}px` }}>
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default CustomerChart;
