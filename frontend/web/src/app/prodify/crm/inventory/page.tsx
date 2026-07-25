import MainLayout from '@/layouts/MainLayout';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import Inventory from '@/features/inventory/components/Inventory';

export const metadata = {
    title: 'Inventory - Prodify CRM',
};

export default function InventoryPage() {
    return (
        <ProtectedRoute>
            <MainLayout>
                <Inventory />
            </MainLayout>
        </ProtectedRoute>
    );
}
