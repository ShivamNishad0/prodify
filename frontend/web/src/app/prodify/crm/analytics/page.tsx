import MainLayout from '@/layouts/MainLayout';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import AnalyticsDashboard from '@/features/analytics/components/AnalyticsDashboard';

export const metadata = {
    title: 'Analytics - Prodify CRM',
};

export default function AnalyticsPage() {
    return (
        <ProtectedRoute>
            <MainLayout>
                <AnalyticsDashboard />
            </MainLayout>
        </ProtectedRoute>
    );
}
