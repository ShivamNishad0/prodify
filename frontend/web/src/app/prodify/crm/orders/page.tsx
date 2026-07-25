import MainLayout from '@/layouts/MainLayout';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import OrderManagement from '@/features/orders/components/OrderManagement';

export const metadata = {
    title: 'Orders - Prodify CRM',
};

export default function OrdersPage() {
    return (
        <ProtectedRoute>
            <MainLayout>
                <OrderManagement />
            </MainLayout>
        </ProtectedRoute>
    );
}
