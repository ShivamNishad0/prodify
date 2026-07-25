import MainLayout from '@/layouts/MainLayout';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import CustomerManagement from '@/features/customers/components/CustomerManagement';

export const metadata = {
    title: 'Customers - Prodify CRM',
};

export default function CustomersPage() {
    return (
        <ProtectedRoute>
            <MainLayout>
                <CustomerManagement />
            </MainLayout>
        </ProtectedRoute>
    );
}
