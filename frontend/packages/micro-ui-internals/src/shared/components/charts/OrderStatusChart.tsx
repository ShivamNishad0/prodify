'use client';

import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface OrderStatusChartProps {
    data: any;
}

const OrderStatusChart: React.FC<OrderStatusChartProps> = ({ data }) => {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Order Status Distribution',
            },
        },
        maintainAspectRatio: false,
    };

    return <Doughnut options={options} data={data} />;
};

export default OrderStatusChart;
