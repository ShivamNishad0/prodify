'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import apiClient from '@/core/api/client';
import { FiUser, FiMail, FiPhone, FiMapPin, FiGlobe, FiBriefcase, FiCamera, FiLock, FiSave, FiAlertCircle, FiCheckCircle, FiFacebook, FiTwitter, FiLinkedin, FiInstagram, FiX } from 'react-icons/fi';

const ProfileDetails = () => {
    const { user, token } = useAuth();
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: '',
        bio: '',
        avatar: '',
        dateOfBirth: '',
        gender: '',
        company: '',
        website: '',
        socialMedia: {
            facebook: '',
            twitter: '',
            linkedin: '',
            instagram: ''
        }
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [activeTab, setActiveTab] = useState('personal');
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchProfile();
    }, [token]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/auth/me');
            const data = response.data;
            setProfile({
                name: data.name || '',
                email: data.email || '',
                phone: data.phone || '',
                address: data.address || '',
                city: data.city || '',
                country: data.country || '',
                bio: data.bio || '',
                avatar: data.avatar || '',
                dateOfBirth: data.dateOfBirth || '',
                gender: data.gender || '',
                company: data.company || '',
                website: data.website || '',
                socialMedia: data.socialMedia || {
                    facebook: '',
                    twitter: '',
                    linkedin: '',
                    instagram: ''
                }
            });
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError('Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('socialMedia.')) {
            const socialField = name.split('.')[1];
            setProfile(prev => ({
                ...prev,
                socialMedia: {
                    ...prev.socialMedia,
                    [socialField]: value
                }
            }));
        } else {
            setProfile(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('avatar', file);

            try {
                const response = await apiClient.put('/auth/avatar', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setProfile(prev => ({
                    ...prev,
                    avatar: response.data.avatar
                }));
                setSuccess('Avatar updated successfully');
                setTimeout(() => setSuccess(''), 3000);
            } catch (err) {
                console.error('Error uploading avatar:', err);
                setError('Failed to upload avatar');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            await apiClient.put('/auth/profile', profile);
            setSuccess('Profile updated successfully');
            setTimeout(() => setSuccess(''), 5000);
        } catch (err: any) {
            setError(err.response?.data?.msg || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setSaving(true);
        setError('');

        try {
            await apiClient.put('/auth/password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setSuccess('Password changed successfully');
            setShowPasswordModal(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => setSuccess(''), 5000);
        } catch (err: any) {
            setError(err.response?.data?.msg || 'Failed to change password');
        } finally {
            setSaving(false);
        }
    };

    const navItemClasses = (tab: string) => `
    flex items-center gap-3 px-6 py-3 rounded-xl cursor-pointer font-bold transition-all w-full text-left text-sm
    ${activeTab === tab ? 'bg-brand-primary text-white shadow-lg' : 'bg-transparent text-gray-400 hover:bg-gray-50 hover:text-gray-600'}
  `;

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-10 h-10 border-4 border-gray-100 border-t-brand-primary rounded-full animate-spin"></div>
                <p className="mt-5 text-gray-400 font-bold uppercase tracking-widest text-[11px]">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="p-7.5 max-w-[1200px] mx-auto">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-brand-primary to-brand-primary-dark text-white p-10 rounded-2xl shadow-lg mb-7.5 flex flex-wrap items-center gap-10 border-none">
                <div className="relative group mx-auto sm:mx-0">
                    <div className="w-32 h-32 rounded-full border-4 border-white/20 p-1 bg-white/10 overflow-hidden">
                        {profile.avatar ? (
                            <img
                                src={profile.avatar.startsWith('http') ? profile.avatar : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}${profile.avatar}`}
                                alt={profile.name}
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl font-bold bg-white/20">
                                {profile.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-1 right-1 bg-white text-brand-primary w-9 h-9 rounded-full flex items-center justify-center shadow-xl cursor-pointer hover:scale-110 transition-transform"
                    >
                        <FiCamera />
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                </div>

                <div className="flex-1 text-center sm:text-left">
                    <h1 className="m-0 mb-2 text-3xl font-bold tracking-tight">{profile.name || 'User Profile'}</h1>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-5 text-sm font-medium opacity-80 uppercase tracking-widest text-[11px]">
                        <span className="flex items-center gap-2"><FiMail /> {profile.email}</span>
                        {profile.company && <span className="flex items-center gap-2"><FiBriefcase /> {profile.company}</span>}
                        {profile.city && <span className="flex items-center gap-2"><FiMapPin /> {profile.city}, {profile.country}</span>}
                    </div>
                    <button
                        onClick={() => setShowPasswordModal(true)}
                        className="mt-6 bg-white/20 text-white border border-white/40 px-5 py-2 rounded-lg text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-white/30 transition-all mx-auto sm:mx-0"
                    >
                        <FiLock /> Security Settings
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-7.5 items-start">
                {/* Navigation */}
                <div className="flex flex-col gap-2 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                    <button onClick={() => setActiveTab('personal')} className={navItemClasses('personal')}><FiUser size={18} /> Personal Detail</button>
                    <button onClick={() => setActiveTab('contact')} className={navItemClasses('contact')}><FiPhone size={18} /> Contact & Addr</button>
                    <button onClick={() => setActiveTab('social')} className={navItemClasses('social')}><FiGlobe size={18} /> Social Networks</button>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-5">
                    {error && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl flex items-center gap-3 font-bold text-sm"><FiAlertCircle /> {error}</div>}
                    {success && <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-xl flex items-center gap-3 font-bold text-sm"><FiCheckCircle /> {success}</div>}

                    <div className="bg-white rounded-2xl p-7.5 shadow-sm border border-gray-100">
                        <form onSubmit={handleSubmit}>
                            {activeTab === 'personal' && (
                                <div className="grid gap-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Full Name</label>
                                            <input name="name" value={profile.name} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm outline-none focus:ring-2 ring-brand-primary/20" placeholder="Your name" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Company</label>
                                            <input name="company" value={profile.company} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm outline-none focus:ring-2 ring-brand-primary/20" placeholder="Company name" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Date of Birth</label>
                                            <input type="date" name="dateOfBirth" value={profile.dateOfBirth} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm outline-none focus:ring-2 ring-brand-primary/20" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Gender</label>
                                            <select name="gender" value={profile.gender} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm outline-none focus:ring-2 ring-brand-primary/20">
                                                <option value="">Select gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Bio</label>
                                        <textarea name="bio" value={profile.bio} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm outline-none focus:ring-2 ring-brand-primary/20 h-32 resize-none" placeholder="Write something about yourself..." />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'contact' && (
                                <div className="grid gap-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Email (Hidden)</label>
                                            <input value={profile.email} disabled className="w-full p-3 bg-gray-100 border-none rounded-xl text-sm text-gray-400 cursor-not-allowed" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Phone</label>
                                            <input name="phone" value={profile.phone} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm outline-none focus:ring-2 ring-brand-primary/20" placeholder="+1..." />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Street Address</label>
                                        <input name="address" value={profile.address} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm outline-none focus:ring-2 ring-brand-primary/20" placeholder="Full address" />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">City</label>
                                            <input name="city" value={profile.city} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm outline-none focus:ring-2 ring-brand-primary/20" placeholder="City" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Country</label>
                                            <input name="country" value={profile.country} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm outline-none focus:ring-2 ring-brand-primary/20" placeholder="Country" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'social' && (
                                <div className="grid gap-5">
                                    <div className="flex items-center gap-4 group">
                                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center transition-colors group-hover:bg-blue-600 group-hover:text-white"><FiFacebook size={20} /></div>
                                        <div className="flex-1">
                                            <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-widest">Facebook</label>
                                            <input name="socialMedia.facebook" value={profile.socialMedia.facebook} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border-none rounded-lg text-sm outline-none focus:ring-2 ring-blue-500/20" placeholder="URL" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 group">
                                        <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center transition-colors group-hover:bg-sky-500 group-hover:text-white"><FiTwitter size={20} /></div>
                                        <div className="flex-1">
                                            <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-widest">Twitter</label>
                                            <input name="socialMedia.twitter" value={profile.socialMedia.twitter} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border-none rounded-lg text-sm outline-none focus:ring-2 ring-sky-500/20" placeholder="URL" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 group">
                                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center transition-colors group-hover:bg-blue-700 group-hover:text-white"><FiLinkedin size={20} /></div>
                                        <div className="flex-1">
                                            <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-widest">LinkedIn</label>
                                            <input name="socialMedia.linkedin" value={profile.socialMedia.linkedin} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border-none rounded-lg text-sm outline-none focus:ring-2 ring-blue-700/20" placeholder="URL" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 group">
                                        <div className="w-12 h-12 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center transition-colors group-hover:bg-pink-600 group-hover:text-white"><FiInstagram size={20} /></div>
                                        <div className="flex-1">
                                            <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-widest">Instagram</label>
                                            <input name="socialMedia.instagram" value={profile.socialMedia.instagram} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border-none rounded-lg text-sm outline-none focus:ring-2 ring-pink-500/20" placeholder="URL" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="mt-10 pt-6 border-t border-gray-50 flex justify-end">
                                <button type="submit" disabled={saving} className="bg-brand-primary text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-xl shadow-brand-primary-dark/20 hover:bg-brand-primary-dark transition-all disabled:opacity-50">
                                    <FiSave /> {saving ? 'Saving...' : 'Save Profile'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000] flex items-center justify-center p-5">
                    <div className="bg-white p-7.5 rounded-2xl shadow-2xl max-w-[450px] w-full animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold flex items-center gap-2 text-gray-800"><FiLock className="text-brand-primary" /> Change Password</h3>
                            <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-red-500"><FiX size={24} /></button>
                        </div>
                        <div className="grid gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-widest">Current Password</label>
                                <input type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))} className="w-full p-3 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 ring-brand-primary/20" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-widest">New Password</label>
                                <input type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))} className="w-full p-3 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 ring-brand-primary/20" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-widest">Confirm Password</label>
                                <input type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))} className="w-full p-3 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 ring-brand-primary/20" />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-8">
                            <button onClick={() => setShowPasswordModal(false)} className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all">Cancel</button>
                            <button onClick={handlePasswordChange} className="flex-1 py-3 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-primary-dark transition-all shadow-lg shadow-brand-primary-dark/20">Update</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileDetails;
