'use client';

import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface SalesByCategoryChartProps {
    data: any;
}

const SalesByCategoryChart: React.FC<SalesByCategoryChartProps> = ({ data }) => {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Sales by Category',
            },
        },
        maintainAspectRatio: false,
    };

    return <Pie options={options} data={data} />;
};

export default SalesByCategoryChart;
