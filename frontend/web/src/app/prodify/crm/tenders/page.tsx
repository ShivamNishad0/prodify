import MainLayout from '@/layouts/MainLayout';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import TenderList from '@/features/tenders/components/TenderList';

export const metadata = {
    title: 'Government Tenders - Prodify CRM',
};

export default function TendersPage() {
    return (
        <ProtectedRoute>
            <MainLayout>
                <TenderList />
            </MainLayout>
        </ProtectedRoute>
    );
}
