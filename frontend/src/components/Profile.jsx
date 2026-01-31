import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { FiUser, FiMail, FiPhone, FiMapPin, FiGlobe, FiBriefcase, FiCamera, FiLock, FiSave, FiAlertCircle, FiCheckCircle, FiFacebook, FiTwitter, FiLinkedin, FiInstagram } from 'react-icons/fi';

function Profile() {
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
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchProfile();
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/auth/me');
      setProfile({
        name: response.data.name || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
        address: response.data.address || '',
        city: response.data.city || '',
        country: response.data.country || '',
        bio: response.data.bio || '',
        avatar: response.data.avatar || '',
        dateOfBirth: response.data.dateOfBirth || '',
        gender: response.data.gender || '',
        company: response.data.company || '',
        website: response.data.website || '',
        socialMedia: response.data.socialMedia || {
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

  const handleInputChange = (e) => {
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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('avatar', file);

      try {
        const response = await axios.put('/api/auth/avatar', formData, {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await axios.put('/api/auth/profile', profile);
      setSuccess('Profile updated successfully');
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      console.error('Error updating profile:', err);
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
      await axios.put('/api/auth/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setSuccess('Password changed successfully');
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      console.error('Error changing password:', err);
      setError(err.response?.data?.msg || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

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

  const inputStyle = {
    width: '100%',
    padding: '12px 15px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#334155',
    backgroundColor: '#fff',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    outline: 'none',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#64748b',
    marginBottom: '8px'
  };

  const navItemStyle = (tab) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 20px',
    borderRadius: '10px',
    cursor: 'pointer',
    backgroundColor: activeTab === tab ? '#3cb2a8' : 'transparent',
    color: activeTab === tab ? 'white' : '#64748b',
    fontWeight: '600',
    transition: 'all 0.2s',
    border: 'none',
    fontSize: '14px'
  });

  if (loading) {
    return (
      <div style={{ ...containerStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #3cb2a8', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ marginTop: '20px', color: '#64748b', fontWeight: '500' }}>Loading profile...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Header Profile Section */}
      <div style={{
        ...cardStyle,
        background: 'linear-gradient(135deg, #3cb2a8 0%, #2a8a81 100%)',
        color: 'white',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        padding: '40px',
        gap: '40px',
        flexWrap: 'wrap'
      }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            width: '130px',
            height: '130px',
            borderRadius: '50%',
            border: '4px solid rgba(255,255,255,0.3)',
            padding: '4px',
            backgroundColor: 'rgba(255,255,255,0.1)'
          }}>
            {profile.avatar ? (
              <img
                src={profile.avatar.startsWith('http') ? profile.avatar : `http://localhost:5001${profile.avatar}`}
                alt={profile.name}
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '50px', fontWeight: 'bold' }}>
                {profile.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{ position: 'absolute', bottom: '5px', right: '5px', background: 'white', color: '#3cb2a8', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}
          >
            <FiCamera size={18} />
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
        </div>

        <div style={{ flex: 1 }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: '700' }}>{profile.name || 'User Name'}</h1>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', opacity: 0.9 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '15px' }}><FiMail /> {profile.email}</span>
            {profile.company && <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '15px' }}><FiBriefcase /> {profile.company}</span>}
            {profile.city && <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '15px' }}><FiMapPin /> {profile.city}, {profile.country}</span>}
          </div>
          <button
            onClick={() => setShowPasswordModal(true)}
            style={{ marginTop: '20px', backgroundColor: 'rgba(255,255,255,0.2)', border: '1px solid white', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <FiLock /> Change Password
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '30px' }}>
        {/* Sidebar Nav */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={() => setActiveTab('personal')} style={navItemStyle('personal')}><FiUser /> Personal Details</button>
          <button onClick={() => setActiveTab('contact')} style={navItemStyle('contact')}><FiPhone /> Contact & Address</button>
          <button onClick={() => setActiveTab('social')} style={navItemStyle('social')}><FiGlobe /> Social Networks</button>
        </div>

        {/* Content Area */}
        <div>
          {error && (
            <div style={{ ...cardStyle, borderLeft: '5px solid #ef4444', backgroundColor: '#fef2f2', color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '12px', padding: '15px' }}>
              <FiAlertCircle size={20} />
              <span style={{ fontWeight: '500' }}>{error}</span>
            </div>
          )}

          {success && (
            <div style={{ ...cardStyle, borderLeft: '5px solid #10b981', backgroundColor: '#ecfdf5', color: '#065f46', display: 'flex', alignItems: 'center', gap: '12px', padding: '15px' }}>
              <FiCheckCircle size={20} />
              <span style={{ fontWeight: '500' }}>{success}</span>
            </div>
          )}

          <div style={cardStyle}>
            <form onSubmit={handleSubmit}>
              {activeTab === 'personal' && (
                <div style={{ display: 'grid', gap: '25px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <label style={labelStyle}>Full Name</label>
                      <input name="name" value={profile.name} onChange={handleInputChange} style={inputStyle} placeholder="Enter your full name" />
                    </div>
                    <div>
                      <label style={labelStyle}>Company Name</label>
                      <input name="company" value={profile.company} onChange={handleInputChange} style={inputStyle} placeholder="Your company" />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <label style={labelStyle}>Date of Birth</label>
                      <input type="date" name="dateOfBirth" value={profile.dateOfBirth} onChange={handleInputChange} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Gender</label>
                      <select name="gender" value={profile.gender} onChange={handleInputChange} style={inputStyle}>
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Bio</label>
                    <textarea name="bio" value={profile.bio} onChange={handleInputChange} style={{ ...inputStyle, minHeight: '120px' }} placeholder="Tell us a bit about yourself..." />
                  </div>
                  <div>
                    <label style={labelStyle}>Website</label>
                    <input name="website" type="url" value={profile.website} onChange={handleInputChange} style={inputStyle} placeholder="https://domain.com" />
                  </div>
                </div>
              )}

              {activeTab === 'contact' && (
                <div style={{ display: 'grid', gap: '25px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <label style={labelStyle}>Email Address (Read-only)</label>
                      <input value={profile.email} disabled style={{ ...inputStyle, backgroundColor: '#f8fafc', cursor: 'not-allowed' }} />
                    </div>
                    <div>
                      <label style={labelStyle}>Phone Number</label>
                      <input name="phone" value={profile.phone} onChange={handleInputChange} style={inputStyle} placeholder="+1 234 567 890" />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Street Address</label>
                    <input name="address" value={profile.address} onChange={handleInputChange} style={inputStyle} placeholder="Full address" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <label style={labelStyle}>City</label>
                      <input name="city" value={profile.city} onChange={handleInputChange} style={inputStyle} placeholder="City" />
                    </div>
                    <div>
                      <label style={labelStyle}>Country</label>
                      <input name="country" value={profile.country} onChange={handleInputChange} style={inputStyle} placeholder="Country" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'social' && (
                <div style={{ display: 'grid', gap: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#3b599815', color: '#3b5998', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiFacebook /></div>
                    <div style={{ flex: 1 }}>
                      <label style={{ ...labelStyle, marginBottom: '4px' }}>Facebook</label>
                      <input name="socialMedia.facebook" value={profile.socialMedia.facebook} onChange={handleInputChange} style={inputStyle} placeholder="Profile URL" />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#1da1f215', color: '#1da1f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiTwitter /></div>
                    <div style={{ flex: 1 }}>
                      <label style={{ ...labelStyle, marginBottom: '4px' }}>Twitter</label>
                      <input name="socialMedia.twitter" value={profile.socialMedia.twitter} onChange={handleInputChange} style={inputStyle} placeholder="Profile URL" />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#0077b515', color: '#0077b5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiLinkedin /></div>
                    <div style={{ flex: 1 }}>
                      <label style={{ ...labelStyle, marginBottom: '4px' }}>LinkedIn</label>
                      <input name="socialMedia.linkedin" value={profile.socialMedia.linkedin} onChange={handleInputChange} style={inputStyle} placeholder="Profile URL" />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#e1306c15', color: '#e1306c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiInstagram /></div>
                    <div style={{ flex: 1 }}>
                      <label style={{ ...labelStyle, marginBottom: '4px' }}>Instagram</label>
                      <input name="socialMedia.instagram" value={profile.socialMedia.instagram} onChange={handleInputChange} style={inputStyle} placeholder="Profile URL" />
                    </div>
                  </div>
                </div>
              )}

              <div style={{ marginTop: '30px', paddingTop: '25px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#3cb2a8', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(60, 178, 168, 0.3)', transition: 'transform 0.2s' }}>
                  <FiSave /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '15px', maxWidth: '450px', width: '90%', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 25px 0', color: '#333', display: 'flex', alignItems: 'center', gap: '12px' }}><FiLock color="#3cb2a8" /> Change Password</h3>
            <div style={{ display: 'grid', gap: '15px' }}>
              <div>
                <label style={labelStyle}>Current Password</label>
                <input type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>New Password</label>
                <input type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Confirm New Password</label>
                <input type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))} style={inputStyle} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '30px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowPasswordModal(false)} style={{ background: 'none', border: '1px solid #e2e8f0', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', color: '#64748b', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handlePasswordChange} style={{ backgroundColor: '#3cb2a8', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Update Password</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;


