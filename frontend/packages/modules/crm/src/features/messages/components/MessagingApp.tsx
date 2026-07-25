'use client';

import React, { useState, useEffect, useRef } from "react";
import apiClient from "@/core/api/client";
import { useAuth } from "@/providers/AuthProvider";

const MessagingApp = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (!selectedUser) return;
        fetchMessages(selectedUser._id);
        const interval = setInterval(() => fetchMessages(selectedUser._id), 3000);
        return () => clearInterval(interval);
    }, [selectedUser]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get("/messages/users");
            setUsers(res.data);
        } catch (err) {
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (userId: string) => {
        try {
            const res = await apiClient.get(`/messages/${userId}`);
            setMessages(res.data);
        } catch (err) {
            console.error("Error:", err);
        }
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;
        try {
            const res = await apiClient.post("/messages", {
                recipient: selectedUser._id,
                content: newMessage,
            });
            setMessages((prev) => [...prev, res.data]);
            setNewMessage("");
        } catch (err) {
            console.error("Error:", err);
        }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-5">
            <div className="flex h-[calc(100vh-140px)] bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                {/* Sidebar */}
                <div className="w-80 border-r border-gray-100 flex flex-col bg-gray-50/30">
                    <div className="p-6.25 bg-gradient-to-br from-brand-primary to-brand-primary-dark text-white">
                        <h2 className="m-0 mb-1 text-2xl font-bold">Messages</h2>
                        <p className="m-0 opacity-80 text-[13px]">{users.length} teammates</p>
                    </div>

                    <div className="p-[15px] relative">
                        <input
                            type="text"
                            placeholder="Search chats..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2.5 bg-white border border-gray-100 rounded-xl outline-none focus:border-brand-primary shadow-sm transition-all"
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="text-center p-10 text-gray-400">Loading chats...</div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="text-center p-10 text-gray-400">No users found</div>
                        ) : (
                            filteredUsers.map((u) => (
                                <div
                                    key={u._id}
                                    onClick={() => setSelectedUser(u)}
                                    className={`p-[15px_20px] cursor-pointer border-b border-gray-50 flex items-center gap-3 transition-all ${selectedUser?._id === u._id ? "bg-brand-primary/5 border-r-4 border-r-brand-primary" : "hover:bg-gray-50"
                                        }`}
                                >
                                    <div className="w-9 h-9 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm">
                                        {u.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className={`text-[15px] ${selectedUser?._id === u._id ? "font-bold text-gray-800" : "font-medium text-gray-600"}`}>
                                        {u.name}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col bg-white">
                    {selectedUser ? (
                        <>
                            <div className="p-5 border-b-2 border-gray-50 flex items-center gap-3 bg-white z-10">
                                <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold">
                                    {selectedUser.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="m-0 text-lg font-bold text-gray-800 leading-tight">{selectedUser.name}</h3>
                                    <div className="flex items-center gap-1.5 text-[11px] text-green-500 font-bold uppercase tracking-wider">
                                        <span className="w-1.5 h-1.5 rounded-full bg-current" /> Online
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-5 bg-gray-50/50 flex flex-col gap-3">
                                {messages.length === 0 ? (
                                    <div className="text-center py-20 opacity-30 flex flex-col items-center">
                                        <div className="text-6xl mb-4">💬</div>
                                        <p className="font-bold text-xl">No messages yet</p>
                                        <p className="text-sm">Start the conversation with {selectedUser.name}</p>
                                    </div>
                                ) : (
                                    messages.map((msg) => (
                                        <div
                                            key={msg._id}
                                            className={`flex ${msg.sender === currentUser?._id ? "justify-end" : "justify-start"}`}
                                        >
                                            <div className={`max-w-[70%] p-[12px_16px] text-sm shadow-sm transition-all ${msg.sender === currentUser?._id
                                                ? "bg-brand-primary text-white rounded-[18px_18px_4px_18px]"
                                                : "bg-white text-gray-700 rounded-[18px_18px_18px_4px] border border-gray-100"
                                                }`}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    ))
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            <form onSubmit={sendMessage} className="p-5 border-t border-gray-100 flex gap-4 bg-white">
                                <input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 p-[12px_20px] rounded-full border border-gray-200 outline-none focus:border-brand-primary bg-gray-50 focus:bg-white transition-all text-sm"
                                />
                                <button type="submit" className="px-7.5 py-3 bg-brand-primary text-white rounded-full font-bold shadow-brand-primary-dark/20 shadow-lg hover:bg-brand-primary-dark transition-all">
                                    Send
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
                            <div className="text-[120px] opacity-10 mb-5 leading-none">💬</div>
                            <h3 className="text-2xl font-bold opacity-30">Select a conversation</h3>
                            <p className="text-sm opacity-20 mt-2">Pick a teammate to start chatting</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessagingApp;
