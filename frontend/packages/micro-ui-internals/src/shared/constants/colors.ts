export const colorPalette = {
    primaryAccent: {
        hex: 'var(--brand-primary)',
        purpose: 'Call-to-Action (CTAs), Active States, Progress Bars, Main Chart Lines.',
    },
    lighterAccent: {
        hex: 'var(--brand-primary-light)',
        purpose: 'Hover States, Subtle Background Fills, Lightest Gradients, Unread Notification Indicators.',
    },
    darkerAccent: {
        hex: 'var(--brand-primary-dark)',
        purpose: 'Key Information Headers, Data Highlighting, Primary Iconography (when isolated).',
    },
    primaryText: {
        hex: 'var(--brand-text-primary)',
        purpose: 'Headings, Critical Data Labels, Main Body Text.',
    },
    secondaryText: {
        hex: 'var(--brand-text-secondary)',
        purpose: 'Placeholder Text, Secondary Descriptions, Timestamps, Table Borders.',
    },
    primaryBackground: {
        hex: 'var(--background)',
        purpose: 'Main Content Pane, Card Backgrounds, Data Tables.',
    },
    secondaryBackground: {
        hex: 'var(--brand-bg-surface)',
        purpose: 'Sidebar Background (if light), Section Dividers, Input Field Backgrounds.',
    },
    successPositive: {
        hex: 'var(--brand-success)',
        purpose: '"Completed" Status, Successful Transaction Messages, Positive Chart Data.',
    },
    alertError: {
        hex: 'var(--brand-error)',
        purpose: '"Failed" Status, Required Field Errors, Low Stock Warnings.',
    }
} as const;

export default colorPalette;
