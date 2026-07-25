import MainLayout from '@/layouts/MainLayout';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import AdminPanel from '@/features/admin/components/AdminPanel';

export const metadata = {
    title: 'Admin Panel - Prodify CRM',
};

export default function AdminPage() {
    return (
        <ProtectedRoute requiredRole="admin">
            <MainLayout>
                <AdminPanel />
            </MainLayout>
        </ProtectedRoute>
    );
}
