import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/api/notifications');
      setNotifications(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`);
      setNotifications(notifications.map(notif => 
        notif._id === id ? { ...notif, isRead: true } : notif
      ));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`/api/notifications/${id}`);
      setNotifications(notifications.filter(notif => notif._id !== id));
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const getNotificationStyle = (type) => {
    switch (type) {
      case 'success':
        return { borderLeft: '4px solid #4caf50' };
      case 'warning':
        return { borderLeft: '4px solid #ff9800' };
      case 'error':
        return { borderLeft: '4px solid #f44336' };
      default:
        return { borderLeft: '4px solid #2196f3' };
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", marginLeft: "50px", textAlign: "center" }}>
        Loading notifications...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", marginLeft: "50px", textAlign: "center", color: "red" }}>
        {error}
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "90vh",
        padding: "20px",
        marginLeft: "50px",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "600px",
        }}
      >
        <h2 style={{ marginBottom: "20px", textAlign: "center" }}>Notifications</h2>

        {notifications.length === 0 ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "18px", color: "#555" }}>
              No new notifications
            </div>
            <div style={{ marginTop: "10px", fontSize: "16px", color: "#888" }}>
              You're all caught up!
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {notifications.map((notification) => (
              <div
                key={notification._id}
                style={{
                  padding: '15px',
                  backgroundColor: notification.isRead ? '#f8f9fa' : '#e3f2fd',
                  borderRadius: '5px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  ...getNotificationStyle(notification.type)
                }}
              >
                <div>
                  <div style={{ fontSize: '16px', fontWeight: notification.isRead ? 'normal' : 'bold' }}>
                    {notification.message}
                  </div>
                  <div style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>
                    {new Date(notification.createdAt).toLocaleDateString()} {new Date(notification.createdAt).toLocaleTimeString()}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {!notification.isRead && (
                    <button
                      onClick={() => markAsRead(notification._id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#2196f3',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Mark as Read
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification._id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#f44336',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;

