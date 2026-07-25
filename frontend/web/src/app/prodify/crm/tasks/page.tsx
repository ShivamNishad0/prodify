import MainLayout from '@/layouts/MainLayout';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import TaskBoard from '@/features/tasks/components/TaskBoard';

export const metadata = {
    title: 'Tasks - Prodify CRM',
};

export default function TasksPage() {
    return (
        <ProtectedRoute>
            <MainLayout>
                <TaskBoard />
            </MainLayout>
        </ProtectedRoute>
    );
}
