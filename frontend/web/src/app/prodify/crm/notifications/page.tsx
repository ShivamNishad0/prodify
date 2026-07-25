import MainLayout from '@/layouts/MainLayout';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import NotificationList from '@/features/notifications/components/NotificationList';

export const metadata = {
    title: 'Notifications - Prodify CRM',
};

export default function NotificationsPage() {
    return (
        <ProtectedRoute>
            <MainLayout>
                <NotificationList />
            </MainLayout>
        </ProtectedRoute>
    );
}
