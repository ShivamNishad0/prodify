'use client';

import React, { useState, useEffect } from "react";
import axios from "@/core/api/client";
import { FiX, FiCheck, FiUser, FiCalendar, FiFlag, FiArrowLeft } from "react-icons/fi";

interface User {
    _id: string;
    name: string;
    role: string;
}

interface TaskFormProps {
    parentId?: string;
    onClose: () => void;
    onSuccess: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ parentId, onClose, onSuccess }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [assignedTo, setAssignedTo] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [dueDate, setDueDate] = useState("");
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get("/auth/users");
                setUsers(res.data);
            } catch (err) {
                console.error("Error fetching users:", err);
            }
        };
        fetchUsers();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post("/tasks", {
                title,
                description,
                assignedTo: assignedTo || undefined,
                parentTask: parentId || undefined,
                priority,
                dueDate: dueDate || undefined
            });
            onSuccess();
            onClose();
        } catch (err) {
            console.error("Error creating task:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="bg-gradient-to-r from-brand-primary to-brand-primary-dark p-6 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            {parentId ? "Create Sub-task" : "Create New Task"}
                        </h2>
                        <p className="text-white/70 text-sm mt-1">
                            {parentId ? "Break down this task into chunks" : "Define a new high-level objective"}
                        </p>
                    </div>
                    <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                        <FiX size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Title</label>
                        <input
                            required
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-brand-primary transition-all"
                            placeholder="What needs to be done?"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-brand-primary transition-all min-h-[100px]"
                            placeholder="Add details about this task..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Assign To</label>
                            <div className="relative">
                                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <select
                                    value={assignedTo}
                                    onChange={(e) => setAssignedTo(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-brand-primary appearance-none transition-all"
                                >
                                    <option value="">Select User</option>
                                    {users.map(u => (
                                        <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Due Date</label>
                            <div className="relative">
                                <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-brand-primary transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Priority</label>
                        <div className="flex gap-3">
                            {['Low', 'Medium', 'High'].map(p => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setPriority(p)}
                                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${priority === p
                                        ? 'bg-brand-primary text-white border-brand-primary shadow-md'
                                        : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-50">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 text-gray-400 font-bold hover:text-gray-600 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={loading}
                            type="submit"
                            className="flex-[2] bg-brand-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-primary-dark shadow-lg shadow-brand-primary/20 transition-all disabled:opacity-50"
                        >
                            {loading ? "Saving..." : <><FiCheck /> {parentId ? "Assign Sub-task" : "Create Task"}</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskForm;
