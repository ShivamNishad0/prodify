import MainLayout from '@/layouts/MainLayout';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import SettingsManager from '@/features/settings/components/SettingsManager';

export const metadata = {
    title: 'Settings - Prodify CRM',
};

export default function SettingsPage() {
    return (
        <ProtectedRoute>
            <MainLayout>
                <SettingsManager />
            </MainLayout>
        </ProtectedRoute>
    );
}
