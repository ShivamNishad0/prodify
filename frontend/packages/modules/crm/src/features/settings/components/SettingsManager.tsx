'use client';

import React, { useState } from 'react';
import { FiUser, FiBell, FiLock, FiGlobe, FiDatabase, FiSave } from 'react-icons/fi';

const SettingsManager = () => {
    const [activeTab, setActiveTab] = useState('Profile');

    const navItemClasses = (tab: string) => `
        flex items-center gap-3 px-5 py-3 rounded-xl cursor-pointer font-semibold transition-all w-full text-left
        ${activeTab === tab ? 'bg-brand-primary text-white shadow-lg' : 'bg-transparent text-gray-500 hover:bg-gray-100'}
    `;

    return (
        <div className="p-7.5 max-w-[1200px] mx-auto min-h-[90vh]">
            <div className="bg-gradient-to-r from-brand-primary to-brand-primary-dark text-white p-6.25 rounded-[15px] shadow-lg mb-7.5">
                <h1 className="m-0 mb-2.5 text-[32px] font-bold">Settings</h1>
                <p className="m-0 opacity-90">Customize your account and application preferences</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-[30px]">
                {/* Sidebar Nav */}
                <div className="flex flex-col gap-1">
                    {[
                        { id: 'Profile', icon: <FiUser /> },
                        { id: 'Notifications', icon: <FiBell /> },
                        { id: 'Security', icon: <FiLock /> },
                        { id: 'General', icon: <FiGlobe /> },
                        { id: 'Backup', icon: <FiDatabase /> },
                    ].map(item => (
                        <button key={item.id} onClick={() => setActiveTab(item.id)} className={navItemClasses(item.id)}>
                            {item.icon} {item.id}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="bg-white rounded-[15px] p-6.25 shadow-sm border border-gray-200">
                    {activeTab === 'Profile' && (
                        <div>
                            <h3 className="mt-0 mb-6.25 text-xl font-bold text-gray-800">Public Profile</h3>
                            <div className="flex items-center gap-5 mb-7.5">
                                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-3xl text-gray-300">
                                    <FiUser />
                                </div>
                                <button className="px-4 py-2 rounded-lg border border-brand-primary bg-transparent text-brand-primary font-bold cursor-pointer hover:bg-brand-primary/5 transition-colors">Change Avatar</button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-4">
                                <div>
                                    <label className="text-sm font-bold text-gray-700 block mb-1.5">First Name</label>
                                    <input className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-brand-primary outline-none" defaultValue="Shivam" />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-700 block mb-1.5">Last Name</label>
                                    <input className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-brand-primary outline-none" defaultValue="Nishad" />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="text-sm font-bold text-gray-700 block mb-1.5">Email Address</label>
                                <input className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-brand-primary outline-none" defaultValue="shivam@example.com" />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-700 block mb-1.5">Bio</label>
                                <textarea className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-brand-primary outline-none h-25 resize-none" defaultValue="Software Developer and Entrepreneur." />
                            </div>
                        </div>
                    )}

                    {activeTab === 'Notifications' && (
                        <div>
                            <h3 className="mt-0 mb-6.25 text-xl font-bold text-gray-800">Notification Preferences</h3>
                            {['Email Notifications', 'Order Updates', 'New Customer Alerts', 'Marketing Emails', 'System Status Alerts'].map(item => (
                                <div key={item} className="flex justify-between items-center py-[15px] border-b border-gray-100 last:border-0">
                                    <span className="font-medium text-gray-700">{item}</span>
                                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-brand-primary cursor-pointer" />
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'Security' && (
                        <div>
                            <h3 className="mt-0 mb-6.25 text-xl font-bold text-gray-800">Security Settings</h3>
                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="text-sm font-bold text-gray-700 block mb-1.5">Current Password</label>
                                    <input type="password" className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-brand-primary outline-none" />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-700 block mb-1.5">New Password</label>
                                    <input type="password" className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-brand-primary outline-none" />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-700 block mb-1.5">Confirm New Password</label>
                                    <input type="password" className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-brand-primary outline-none" />
                                </div>
                            </div>
                            <div className="p-5 bg-orange-50 rounded-xl border border-orange-100 mt-[30px]">
                                <div className="font-bold text-orange-800 mb-1.5">Two-Factor Authentication</div>
                                <div className="text-sm text-orange-700/80">Add an extra layer of security to your account by enabling 2FA.</div>
                                <button className="mt-4 px-4 py-2 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors">Enable 2FA</button>
                            </div>
                        </div>
                    )}

                    <div className="mt-7.5 pt-5 border-t border-gray-100 flex justify-end">
                        <button className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-white font-bold rounded-lg shadow-lg shadow-brand-primary-dark/30 hover:bg-brand-primary-dark transition-all">
                            <FiSave /> Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsManager;
