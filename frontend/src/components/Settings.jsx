import React, { useState } from 'react';
import { FiUser, FiBell, FiLock, FiGlobe, FiDatabase, FiSave } from 'react-icons/fi';

function Settings() {
    const [activeTab, setActiveTab] = useState('Profile');

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
        border: '1px solid #e0e0e0'
    };

    const navItemStyle = (tab) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 20px',
        borderRadius: '10px',
        cursor: 'pointer',
        backgroundColor: activeTab === tab ? '#3cb2a8' : 'transparent',
        color: activeTab === tab ? 'white' : '#666',
        fontWeight: '600',
        transition: 'all 0.2s',
        border: 'none',
        width: '100%',
        textAlign: 'left',
        marginBottom: '5px'
    });

    const inputStyle = {
        width: '100%',
        padding: '10px',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
        marginTop: '5px',
        marginBottom: '15px',
        fontSize: '14px'
    };

    const labelStyle = {
        fontSize: '14px',
        fontWeight: '600',
        color: '#444'
    };

    return (
        <div style={containerStyle}>
            <div style={{ ...cardStyle, background: 'linear-gradient(135deg, #3cb2a8 0%, #2a8a81 100%)', color: 'white', marginBottom: '30px' }}>
                <h1 style={{ margin: '0 0 10px 0', fontSize: '32px' }}>Settings</h1>
                <p style={{ margin: '0', opacity: '0.9' }}>Customize your account and application preferences</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '30px' }}>
                {/* Sidebar Nav */}
                <div>
                    <button onClick={() => setActiveTab('Profile')} style={navItemStyle('Profile')}><FiUser /> Profile</button>
                    <button onClick={() => setActiveTab('Notifications')} style={navItemStyle('Notifications')}><FiBell /> Notifications</button>
                    <button onClick={() => setActiveTab('Security')} style={navItemStyle('Security')}><FiLock /> Security</button>
                    <button onClick={() => setActiveTab('General')} style={navItemStyle('General')}><FiGlobe /> General</button>
                    <button onClick={() => setActiveTab('Backup')} style={navItemStyle('Backup')}><FiDatabase /> Backup & Restore</button>
                </div>

                {/* Content Area */}
                <div style={cardStyle}>
                    {activeTab === 'Profile' && (
                        <div>
                            <h3 style={{ marginTop: 0, marginBottom: '25px', color: '#333' }}>Public Profile</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                                <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', color: '#ccc' }}>
                                    <FiUser />
                                </div>
                                <button style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #3cb2a8', backgroundColor: 'transparent', color: '#3cb2a8', fontWeight: '600', cursor: 'pointer' }}>Change Avatar</button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <label style={labelStyle}>First Name</label>
                                    <input style={inputStyle} defaultValue="Shivam" />
                                </div>
                                <div>
                                    <label style={labelStyle}>Last Name</label>
                                    <input style={inputStyle} defaultValue="Nishad" />
                                </div>
                            </div>
                            <div>
                                <label style={labelStyle}>Email Address</label>
                                <input style={inputStyle} defaultValue="shivam@example.com" />
                            </div>
                            <div>
                                <label style={labelStyle}>Bio</label>
                                <textarea style={{ ...inputStyle, height: '100px' }} defaultValue="Software Developer and Entrepreneur." />
                            </div>
                        </div>
                    )}

                    {activeTab === 'Notifications' && (
                        <div>
                            <h3 style={{ marginTop: 0, marginBottom: '25px', color: '#333' }}>Notification Preferences</h3>
                            {['Email Notifications', 'Order Updates', 'New Customer Alerts', 'Marketing Emails', 'System Status Alerts'].map(item => (
                                <div key={item} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #f0f0f0' }}>
                                    <span style={{ fontWeight: '500' }}>{item}</span>
                                    <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: '#3cb2a8' }} />
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'Security' && (
                        <div>
                            <h3 style={{ marginTop: 0, marginBottom: '25px', color: '#333' }}>Security Settings</h3>
                            <div>
                                <label style={labelStyle}>Current Password</label>
                                <input type="password" style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>New Password</label>
                                <input type="password" style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Confirm New Password</label>
                                <input type="password" style={inputStyle} />
                            </div>
                            <div style={{ padding: '20px', backgroundColor: '#fff8f1', borderRadius: '10px', border: '1px solid #ffd8a8', marginTop: '10px' }}>
                                <div style={{ fontWeight: 'bold', color: '#d9480f', marginBottom: '5px' }}>Two-Factor Authentication</div>
                                <div style={{ fontSize: '14px', color: '#862e08' }}>Add an extra layer of security to your account by enabling 2FA.</div>
                                <button style={{ marginTop: '15px', padding: '8px 16px', borderRadius: '6px', border: 'none', backgroundColor: '#fd7e14', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Enable 2FA</button>
                            </div>
                        </div>
                    )}

                    <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'flex-end' }}>
                        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '8px', border: 'none', backgroundColor: '#3cb2a8', color: 'white', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(60, 178, 168, 0.3)' }}>
                            <FiSave /> Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;