import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const RevenueChart = ({ data, height = 300 }) => {
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
        text: 'Revenue Trend (Monthly)',
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
            return `Revenue: Rs. ${context.parsed.y.toLocaleString()}`;
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
            return 'Rs. ' + (value / 1000) + 'K';
          }
        }
      }
    },
    elements: {
      line: {
        borderWidth: 3
      },
      point: {
        radius: 4,
        hoverRadius: 6,
        backgroundColor: '#3cb2a8',
        borderColor: '#ffffff',
        borderWidth: 2
      }
    }
  };


  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Revenue Analytics</h3>
            <p className="text-gray-600">Monthly revenue trends and growth patterns</p>
          </div>
          <div className="flex space-x-2">
            <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
              +12.5%
            </div>
            <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              YoY Growth
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-4">
        <div style={{ height: `${height}px` }}>
          <Line data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
