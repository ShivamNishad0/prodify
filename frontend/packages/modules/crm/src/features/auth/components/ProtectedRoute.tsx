'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { useEffect } from 'react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
    const { isAuthenticated, loading, user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.replace('/welcome');
        }

        if (!loading && isAuthenticated && requiredRole) {
            const hasRequiredRole = user?.role === requiredRole ||
                (requiredRole === 'staff' && ['admin', 'manager', 'employee'].includes(user?.role || ''));

            if (!hasRequiredRole) {
                router.replace('/');
            }
        }
    }, [isAuthenticated, loading, user, requiredRole, router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-lg text-gray-500">
                Loading...
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // Will redirect in useEffect
    }

    if (requiredRole) {
        const hasRequiredRole = user?.role === requiredRole ||
            (requiredRole === 'staff' && ['admin', 'manager', 'employee'].includes(user?.role || ''));

        if (!hasRequiredRole) {
            return null; // Will redirect in useEffect
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;
