import MainLayout from '@/layouts/MainLayout';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import NotesGrid from '@/features/notes/components/NotesGrid';

export const metadata = {
    title: 'Notes - Prodify CRM',
};

export default function NotesPage() {
    return (
        <ProtectedRoute>
            <MainLayout>
                <NotesGrid />
            </MainLayout>
        </ProtectedRoute>
    );
}
