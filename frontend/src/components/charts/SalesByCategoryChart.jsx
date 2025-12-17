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

const SalesByCategoryChart = ({ data, height = 300 }) => {
  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Sales by Category',
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
            return `Sales: Rs. ${context.parsed.x.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
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
      },
      y: {
        grid: {
          display: false
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 11
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
            <h3 className="text-xl font-bold text-gray-900 mb-2">Category Performance</h3>
            <p className="text-gray-600">Sales distribution across product categories</p>
          </div>
          <div className="flex space-x-2">
            <div className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm font-medium">
              Rs. 115K
            </div>
            <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
              Total Sales
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl p-4">
        <div style={{ height: `${height}px` }}>
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default SalesByCategoryChart;
