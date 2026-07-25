'use client';

import React, { useState, useEffect } from 'react';
import apiClient from '@/core/api/client';

const NotificationList = () => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/notifications');
            setNotifications(response.data);
        } catch (err) {
            setError('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await apiClient.put(`/notifications/${id}/read`);
            setNotifications(notifications.map(notif =>
                notif._id === id ? { ...notif, isRead: true } : notif
            ));
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    };

    const deleteNotification = async (id: string) => {
        try {
            await apiClient.delete(`/notifications/${id}`);
            setNotifications(notifications.filter(notif => notif._id !== id));
        } catch (err) {
            console.error('Error deleting notification:', err);
        }
    };

    const getBorderColor = (type: string) => {
        switch (type) {
            case 'success': return 'border-l-green-500';
            case 'warning': return 'border-l-amber-500';
            case 'error': return 'border-l-red-500';
            default: return 'border-l-blue-500';
        }
    };

    return (
        <div className="min-h-[90vh] p-5 flex justify-center items-start">
            <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-[700px] border border-gray-100">
                <h2 className="text-2xl font-bold mb-7.5 text-center text-gray-800">Notifications</h2>

                {loading ? (
                    <div className="text-center py-10 text-gray-400">Loading notifications...</div>
                ) : error ? (
                    <div className="text-center py-10 text-red-500">{error}</div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-10">
                        <div className="text-lg text-gray-600">No new notifications</div>
                        <div className="mt-2.5 text-sm text-gray-400">You're all caught up!</div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-[15px]">
                        {notifications.map((notif) => (
                            <div
                                key={notif._id}
                                className={`p-5 rounded-xl flex justify-between items-center shadow-sm border-l-4 transition-all ${notif.isRead ? 'bg-gray-50' : 'bg-brand-primary-light/10'
                                    } ${getBorderColor(notif.type)}`}
                            >
                                <div>
                                    <div className={`text-base ${notif.isRead ? 'font-normal text-gray-600' : 'font-bold text-gray-800'}`}>
                                        {notif.message}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1.5 uppercase font-semibold tracking-wider">
                                        {new Date(notif.createdAt).toLocaleDateString()} • {new Date(notif.createdAt).toLocaleTimeString()}
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    {!notif.isRead && (
                                        <button
                                            onClick={() => markAsRead(notif._id)}
                                            className="bg-transparent border-none text-brand-primary cursor-pointer text-sm font-bold hover:underline"
                                        >
                                            Read
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteNotification(notif._id)}
                                        className="bg-transparent border-none text-red-400 cursor-pointer text-sm font-bold hover:underline"
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
};

export default NotificationList;
