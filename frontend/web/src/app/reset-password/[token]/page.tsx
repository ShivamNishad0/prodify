import ResetPasswordForm from '@/features/auth/components/ResetPasswordForm';

export function generateStaticParams() {
    return [];
}

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
    return <ResetPasswordForm token={params.token} />;
}
