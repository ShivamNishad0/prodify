import MainLayout from '@/layouts/MainLayout';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import AboutSystem from '@/features/about/components/AboutSystem';

export const metadata = {
    title: 'About - Prodify CRM',
};

export default function AboutPage() {
    return (
        <ProtectedRoute>
            <MainLayout>
                <AboutSystem />
            </MainLayout>
        </ProtectedRoute>
    );
}
