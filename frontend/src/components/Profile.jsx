import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

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
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const cardStyle = {
    background: 'white',
    borderRadius: '15px',
    padding: '30px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    marginBottom: '25px',
    border: '1px solid #e0e0e0'
  };

  const buttonStyle = {
    backgroundColor: '#3cb2a8',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  };

  const secondaryButtonStyle = {
    backgroundColor: '#0d6dfda9',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.3s ease'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    margin: '8px 0',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    boxSizing: 'border-box',
    fontSize: '14px',
    transition: 'border-color 0.3s ease'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#333',
    fontSize: '14px'
  };

  const tabStyle = (isActive) => ({
    padding: '12px 24px',
    border: 'none',
    background: isActive ? '#3cb2a8' : 'transparent',
    color: isActive ? 'white' : '#333',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    marginRight: '10px',
    transition: 'all 0.3s ease'
  });

  if (loading) {
    return (
      <div style={{ ...containerStyle, textAlign: 'center', paddingTop: '100px' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
        <p style={{ color: '#666' }}>Loading profile...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={containerStyle}>
        {/* Header */}
        <div style={{ ...cardStyle, marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '30px' }}>
            {/* Avatar Section */}
            <div style={{ position: 'relative' }}>
              {profile.avatar ? (
                <img 
                  src={profile.avatar.startsWith('http') ? profile.avatar : `http://localhost:5001${profile.avatar}`}
                  alt={profile.name}
                  style={{ 
                    width: '120px', 
                    height: '120px', 
                    borderRadius: '50%', 
                    objectFit: 'cover',
                    border: '4px solid #3cb2a8'
                  }}
                />
              ) : (
                <div style={{ 
                  width: '120px', 
                  height: '120px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #3cb2a8 0%, #2a8a81 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px',
                  color: 'white',
                  fontWeight: 'bold'
                }}>
                  {profile.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  position: 'absolute',
                  bottom: '0',
                  right: '0',
                  background: '#3cb2a8',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px'
                }}
              >
                📷
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </div>

            {/* User Info */}
            <div style={{ flex: 1 }}>
              <h1 style={{ margin: '0 0 10px 0', fontSize: '28px', color: '#333' }}>
                {profile.name || 'Your Name'}
              </h1>
              <p style={{ margin: '0 0 5px 0', color: '#666' }}>{profile.email}</p>
              {profile.company && (
                <p style={{ margin: '0', color: '#666' }}>🏢 {profile.company}</p>
              )}
              <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                <button
                  style={secondaryButtonStyle}
                  onClick={() => setShowPasswordModal(true)}
                >
                  🔒 Change Password
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div style={{
            ...cardStyle,
            backgroundColor: '#ffebee',
            border: '1px solid #ffcdd2',
            color: '#c62828',
            padding: '15px',
            marginBottom: '20px',
            borderRadius: '8px'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {success && (
          <div style={{
            ...cardStyle,
            backgroundColor: '#e8f5e8',
            border: '1px solid #c8e6c9',
            color: '#2e7d32',
            padding: '15px',
            marginBottom: '20px',
            borderRadius: '8px'
          }}>
            <strong>Success:</strong> {success}
          </div>
        )}

        {/* Tabs */}
        <div style={{ marginBottom: '20px' }}>
          <button
            style={tabStyle(activeTab === 'personal')}
            onClick={() => setActiveTab('personal')}
          >
            👤 Personal Info
          </button>
          <button
            style={tabStyle(activeTab === 'contact')}
            onClick={() => setActiveTab('contact')}
          >
            📞 Contact
          </button>
          <button
            style={tabStyle(activeTab === 'social')}
            onClick={() => setActiveTab('social')}
          >
            🌐 Social Media
          </button>
        </div>

        {/* Profile Form */}
        <div style={cardStyle}>
          <form onSubmit={handleSubmit}>
            {activeTab === 'personal' && (
              <>
                <h3 style={{ color: '#3cb2a8', marginBottom: '25px', fontSize: '20px' }}>
                  Personal Information
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                  <div>
                    <label style={labelStyle}>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleInputChange}
                      style={inputStyle}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={profile.dateOfBirth}
                      onChange={handleInputChange}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Gender</label>
                    <select
                      name="gender"
                      value={profile.gender}
                      onChange={handleInputChange}
                      style={inputStyle}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer_not_to_say">Prefer not to say</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Company</label>
                    <input
                      type="text"
                      name="company"
                      value={profile.company}
                      onChange={handleInputChange}
                      style={inputStyle}
                      placeholder="Company name"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Website</label>
                    <input
                      type="url"
                      name="website"
                      value={profile.website}
                      onChange={handleInputChange}
                      style={inputStyle}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>
                <div style={{ marginTop: '20px' }}>
                  <label style={labelStyle}>Bio</label>
                  <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleInputChange}
                    style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
                    placeholder="Tell us about yourself..."
                    rows={5}
                  />
                </div>
              </>
            )}

            {activeTab === 'contact' && (
              <>
                <h3 style={{ color: '#3cb2a8', marginBottom: '25px', fontSize: '20px' }}>
                  Contact Information
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                  <div>
                    <label style={labelStyle}>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone}
                      onChange={handleInputChange}
                      style={inputStyle}
                      placeholder="+1 234 567 890"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Address</label>
                    <input
                      type="text"
                      name="address"
                      value={profile.address}
                      onChange={handleInputChange}
                      style={inputStyle}
                      placeholder="Street address"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>City</label>
                    <input
                      type="text"
                      name="city"
                      value={profile.city}
                      onChange={handleInputChange}
                      style={inputStyle}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Country</label>
                    <input
                      type="text"
                      name="country"
                      value={profile.country}
                      onChange={handleInputChange}
                      style={inputStyle}
                      placeholder="Country"
                    />
                  </div>
                </div>
              </>
            )}

            {activeTab === 'social' && (
              <>
                <h3 style={{ color: '#3cb2a8', marginBottom: '25px', fontSize: '20px' }}>
                  Social Media Links
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                  <div>
                    <label style={labelStyle}>Facebook</label>
                    <input
                      type="url"
                      name="socialMedia.facebook"
                      value={profile.socialMedia.facebook}
                      onChange={handleInputChange}
                      style={inputStyle}
                      placeholder="https://facebook.com/username"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Twitter</label>
                    <input
                      type="url"
                      name="socialMedia.twitter"
                      value={profile.socialMedia.twitter}
                      onChange={handleInputChange}
                      style={inputStyle}
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>LinkedIn</label>
                    <input
                      type="url"
                      name="socialMedia.linkedin"
                      value={profile.socialMedia.linkedin}
                      onChange={handleInputChange}
                      style={inputStyle}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Instagram</label>
                    <input
                      type="url"
                      name="socialMedia.instagram"
                      value={profile.socialMedia.instagram}
                      onChange={handleInputChange}
                      style={inputStyle}
                      placeholder="https://instagram.com/username"
                    />
                  </div>
                </div>
              </>
            )}

            <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e0e0e0' }}>
              <button 
                type="submit" 
                style={buttonStyle}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '15px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            maxWidth: '450px',
            width: '90%'
          }}>
            <h3 style={{ color: '#3cb2a8', marginBottom: '25px', fontSize: '24px' }}>
              🔒 Change Password
            </h3>

            {error && (
              <div style={{
                backgroundColor: '#ffebee',
                color: '#c62828',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '20px',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Current Password</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                style={inputStyle}
                placeholder="Enter current password"
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>New Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                style={inputStyle}
                placeholder="Enter new password"
              />
            </div>
            <div style={{ marginBottom: '25px' }}>
              <label style={labelStyle}>Confirm New Password</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                style={inputStyle}
                placeholder="Confirm new password"
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                style={secondaryButtonStyle}
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  setError('');
                }}
              >
                Cancel
              </button>
              <button
                style={buttonStyle}
                onClick={handlePasswordChange}
                disabled={saving}
              >
                {saving ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;

