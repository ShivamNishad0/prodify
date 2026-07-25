import MainLayout from '@/layouts/MainLayout';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import ReportGeneration from '@/features/reports/components/ReportGeneration';

export const metadata = {
    title: 'Reports - Prodify CRM',
};

export default function ReportsPage() {
    return (
        <ProtectedRoute>
            <MainLayout>
                <ReportGeneration />
            </MainLayout>
        </ProtectedRoute>
    );
}
