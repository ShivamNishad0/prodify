import React from 'react';
import { FiHelpCircle, FiMessageCircle, FiPhone, FiMail, FiChevronRight, FiSend } from 'react-icons/fi';

function Support() {
    const containerStyle = {
        padding: '30px',
        maxWidth: '1200px',
        margin: '0 auto',
        minHeight: '90vh'
    };

    const cardStyle = {
        background: 'white',
        borderRadius: '15px',
        padding: '25px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid #e0e0e0',
        marginBottom: '25px'
    };

    const categories = [
        { title: 'Getting Started', icon: <FiHelpCircle />, count: 12 },
        { title: 'Account & Billing', icon: <FiMessageCircle />, count: 8 },
        { title: 'Orders & Shipping', icon: <FiMessageCircle />, count: 15 },
        { title: 'Technical Support', icon: <FiHelpCircle />, count: 5 },
    ];

    const faqs = [
        { q: 'How do I reset my password?', a: 'Go to the login page, click "Forgot Password," and follow the instructions sent to your email.' },
        { q: 'Where can I find my order history?', a: 'Navigate to the "Orders" tab in the sidebar to view all your previous and current orders.' },
        { q: 'How do I update my billing information?', a: 'You can update your billing details in the "Settings" section under the "Profile" tab.' },
    ];

    return (
        <div style={containerStyle}>
            <div style={{ ...cardStyle, background: 'linear-gradient(135deg, #3cb2a8 0%, #2a8a81 100%)', color: 'white', marginBottom: '30px', textAlign: 'center', padding: '50px 25px' }}>
                <h1 style={{ margin: '0 0 10px 0', fontSize: '36px' }}>How can we help you?</h1>
                <p style={{ margin: '0 0 30px 0', opacity: '0.9', fontSize: '18px' }}>Search our help center or contact our support team</p>
                <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
                    <input
                        style={{ width: '100%', padding: '15px 25px', borderRadius: '30px', border: 'none', fontSize: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                        placeholder="Search for articles, guides..."
                    />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                {categories.map((cat, i) => (
                    <div key={i} style={{ ...cardStyle, marginBottom: 0, textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s' }}>
                        <div style={{ fontSize: '30px', color: '#3cb2a8', marginBottom: '15px' }}>{cat.icon}</div>
                        <h3 style={{ margin: '0 0 10px 0' }}>{cat.title}</h3>
                        <span style={{ fontSize: '14px', color: '#888' }}>{cat.count} Articles</span>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                {/* FAQs */}
                <div>
                    <h2 style={{ marginBottom: '20px' }}>Frequently Asked Questions</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {faqs.map((faq, i) => (
                            <div key={i} style={cardStyle}>
                                <div style={{ fontWeight: 'bold', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    {faq.q}
                                    <FiChevronRight color="#3cb2a8" />
                                </div>
                                <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>{faq.a}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Form */}
                <div>
                    <h2 style={{ marginBottom: '20px' }}>Send us a Message</h2>
                    <div style={cardStyle}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <input style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e0e0e0' }} placeholder="Your Name" />
                            <input style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e0e0e0' }} placeholder="Email Address" />
                        </div>
                        <input style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e0e0e0', marginTop: '15px' }} placeholder="Subject" />
                        <textarea style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e0e0e0', marginTop: '15px', height: '120px' }} placeholder="Your Message..." />
                        <button style={{
                            marginTop: '20px',
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: '#3cb2a8',
                            color: 'white',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px'
                        }}>
                            <FiSend /> Send Message
                        </button>
                    </div>

                    <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                        <div style={{ ...cardStyle, flex: 1, marginBottom: 0, textAlign: 'center', padding: '15px' }}>
                            <FiPhone color="#3cb2a8" size={20} />
                            <div style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '5px' }}>+1 234 567 890</div>
                        </div>
                        <div style={{ ...cardStyle, flex: 1, marginBottom: 0, textAlign: 'center', padding: '15px' }}>
                            <FiMail color="#3cb2a8" size={20} />
                            <div style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '5px' }}>support@crm.com</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Support;