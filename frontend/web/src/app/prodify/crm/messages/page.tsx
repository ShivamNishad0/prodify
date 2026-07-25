import MainLayout from '@/layouts/MainLayout';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import MessagingApp from '@/features/messages/components/MessagingApp';

export const metadata = {
    title: 'Messages - Prodify CRM',
};

export default function MessagesPage() {
    return (
        <ProtectedRoute>
            <MainLayout>
                <MessagingApp />
            </MainLayout>
        </ProtectedRoute>
    );
}
