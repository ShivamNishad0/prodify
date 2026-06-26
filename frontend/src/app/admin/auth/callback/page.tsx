'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';

export default function AuthCallback() {
    const { loginWithKeycloak } = useAuth();
    const router = useRouter();
    const [status, setStatus] = useState('Processing authentication...');

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const result = await loginWithKeycloak();
                if (result.success) {
                    setStatus('Authentication successful! Redirecting...');
                    router.push('/');
                } else {
                    setStatus('Authentication failed: ' + (result.error || 'Unknown error'));
                    setTimeout(() => router.push('/login'), 3000);
                }
            } catch (err: any) {
                setStatus('Authentication error: ' + err.message);
                setTimeout(() => router.push('/login'), 3000);
            }
        };

        handleCallback();
    }, [loginWithKeycloak, router]);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
            color: 'white',
            fontFamily: 'system-ui, sans-serif'
        }}>
            <div style={{
                background: '#1e293b',
                padding: '40px',
                borderRadius: '16px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                textAlign: 'center',
                border: '1px solid #334155'
            }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    border: '3px solid #334155',
                    borderTop: '3px solid #3cb2a8',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 20px'
                }} />
                <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 500 }}>{status}</p>
                <style dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}} />
            </div>
        </div>
    );
}
