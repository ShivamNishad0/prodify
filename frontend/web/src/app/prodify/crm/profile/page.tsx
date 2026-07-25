import MainLayout from '@/layouts/MainLayout';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import ProfileDetails from '@/features/profile/components/ProfileDetails';

export const metadata = {
    title: 'My Profile - Prodify CRM',
};

export default function ProfilePage() {
    return (
        <ProtectedRoute>
            <MainLayout>
                <ProfileDetails />
            </MainLayout>
        </ProtectedRoute>
    );
}
