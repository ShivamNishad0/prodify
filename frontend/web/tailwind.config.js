const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "../packages/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    primary: 'var(--brand-primary)',
                    'primary-dark': 'var(--brand-primary-dark)',
                    'primary-light': 'var(--brand-primary-light)',
                    'text-primary': 'var(--brand-text-primary)',
                    'text-secondary': 'var(--brand-text-secondary)',
                    'bg-surface': 'var(--brand-bg-surface)',
                    success: 'var(--brand-success)',
                    error: 'var(--brand-error)',
                }
            },
            padding: {
                '6.25': '25px',
                '7.5': '30px',
                '10': '40px',
                '12.5': '50px',
            },
            margin: {
                '2.5': '10px',
                '6.25': '25px',
                '7.5': '30px',
            }
        },
    },
    plugins: [nextui()],
}
