'use client';

import { useEffect } from 'react';
import { initHRMSComponents } from '@prodify/digit-ui-module-hrms';
// import { initCRMComponents } from '@prodify/digit-ui-module-crm'; // uncomment when CRM module exports it

export default function UpyogRegistryInit({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Initialize standard UPYOG component registry
        if (typeof window !== 'undefined') {
            const win = window as any;
            win.Digit = win.Digit || {};
            win.Digit.ComponentRegistryService = win.Digit.ComponentRegistryService || {
                setup: () => {},
                setComponent: (name: string, component: any) => {
                    win.Digit.ComponentRegistryService[name] = component;
                },
                getComponent: (name: string) => win.Digit.ComponentRegistryService[name]
            };

            // Call initialization functions for all modules
            initHRMSComponents();
            // initCRMComponents();
            
            console.log("UPYOG Component Registry Initialized");
        }
    }, []);

    return <>{children}</>;
}
