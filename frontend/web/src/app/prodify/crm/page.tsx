import MainLayout from '@/layouts/MainLayout';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import Dashboard from '@/features/dashboard/components/Dashboard';

export const metadata = {
  title: 'Dashboard - Prodify CRM',
};

export default function HomePage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <Dashboard />
      </MainLayout>
    </ProtectedRoute>
  );
}
