'use client';

import { useParams } from 'next/navigation';
import ResetPasswordForm from '@/features/auth/components/ResetPasswordForm';

export default function ResetPasswordPage() {
    const params = useParams();
    const token = params.token as string;

    return <ResetPasswordForm token={token} />;
}
