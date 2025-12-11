const colorPalette = {
  primaryAccent: {
    hex: '#7bcbc4',
    purpose: 'Call-to-Action (CTAs), Active States, Progress Bars, Main Chart Lines.',
    whyNice: "It's your brand color, conveying clarity, efficiency, and a modern, calming feel."
  },
  lighterAccent: {
    hex: '#C8E8E6',
    purpose: 'Hover States, Subtle Background Fills, Lightest Gradients, Unread Notification Indicators.',
    whyNice: 'A washed-out version of the accent; provides a soft visual reward without being jarring.'
  },
  darkerAccent: {
    hex: '#4B8C86',
    purpose: 'Key Information Headers, Data Highlighting, Primary Iconography (when isolated).',
    whyNice: 'A deeper tone that provides necessary contrast and grounding for the primary accent color.'
  },
  primaryText: {
    hex: '#2A2A2A',
    purpose: 'Headings, Critical Data Labels, Main Body Text.',
    whyNice: 'A deep, near-black charcoal that offers maximum readability and a softer look than pure black.'
  },
  secondaryText: {
    hex: '#666666',
    purpose: 'Placeholder Text, Secondary Descriptions, Timestamps, Table Borders.',
    whyNice: 'A mid-gray that softens the visual hierarchy, helping the main data stand out.'
  },
  primaryBackground: {
    hex: '#FFFFFF',
    purpose: 'Main Content Pane, Card Backgrounds, Data Tables.',
    whyNice: 'Pure white provides the cleanest, most professional backdrop, making all data and colors pop.'
  },
  secondaryBackground: {
    hex: '#F5F5F5',
    purpose: 'Sidebar Background (if light), Section Dividers, Input Field Backgrounds.',
    whyNice: 'A subtle off-white that adds depth and separation between content blocks without being distracting.'
  },
  successPositive: {
    hex: '#5CB85C',
    purpose: '"Completed" Status, Successful Transaction Messages, Positive Chart Data.',
    whyNice: 'A standard, pleasant green that universally signifies positive outcomes.'
  },
  alertError: {
    hex: '#D9534F',
    purpose: '"Failed" Status, Required Field Errors, Low Stock Warnings.',
    whyNice: 'A standard red that immediately draws attention to problems or critical alerts.'
  }
};

export default colorPalette;
