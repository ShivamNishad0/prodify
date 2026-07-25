import MainLayout from '@/layouts/MainLayout';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import ProductManagement from '@/features/products/components/ProductManagement';

export const metadata = {
    title: 'Products - Prodify CRM',
};

export default function ProductsPage() {
    return (
        <ProtectedRoute>
            <MainLayout>
                <ProductManagement />
            </MainLayout>
        </ProtectedRoute>
    );
}
