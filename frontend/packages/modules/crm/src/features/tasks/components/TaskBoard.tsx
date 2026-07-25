'use client';

import React, { useState, useEffect } from "react";
import { FiPlus, FiClock, FiCheckCircle, FiSearch, FiChevronRight, FiChevronDown, FiPlusCircle, FiBarChart2, FiFlag } from "react-icons/fi";
import axios from "@/core/api/client";
import TaskForm from "./TaskForm";

const TaskBoard = () => {
    const [activeTab, setActiveTab] = useState("All");
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedParentId, setSelectedParentId] = useState<string | undefined>();
    const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

    const statusColors: any = {
        'In Progress': 'bg-blue-50 text-blue-700',
        'Pending': 'bg-gray-100 text-gray-600',
        'Completed': 'bg-green-50 text-green-700',
    };

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/tasks");
            setTasks(res.data);
        } catch (err) {
            console.error("Error fetching tasks:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const toggleExpand = (taskId: string) => {
        const newExpanded = new Set(expandedTasks);
        if (newExpanded.has(taskId)) {
            newExpanded.delete(taskId);
        } else {
            newExpanded.add(taskId);
        }
        setExpandedTasks(newExpanded);
    };

    const handleCreateTask = (parentId?: string) => {
        setSelectedParentId(parentId);
        setShowForm(true);
    };

    const updateTaskProgress = async (taskId: string, newProgress: number) => {
        try {
            await axios.put(`/tasks/${taskId}`, { progress: newProgress });
            fetchTasks(); // Refresh to see rollup
        } catch (err) {
            console.error("Error updating progress:", err);
        }
    };

    const filteredTasks = tasks.filter(task => {
        if (activeTab === "All") return true;
        return task.status === activeTab;
    });

    const rootTasks = filteredTasks.filter(t => !t.parentTask);

    const TaskItem = ({ task, depth = 0 }: { task: any, depth?: number }) => {
        const hasSubtasks = tasks.some(t => t.parentTask?._id === task._id || t.parentTask === task._id);
        const subtasks = tasks.filter(t => (t.parentTask?._id === task._id || t.parentTask === task._id));
        const isExpanded = expandedTasks.has(task._id);

        return (
            <div className="border-b border-gray-50 last:border-none">
                <div
                    className={`p-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors group cursor-pointer`}
                    style={{ paddingLeft: `${1.25 + depth * 2}rem` }}
                    onClick={() => hasSubtasks && toggleExpand(task._id)}
                >
                    <div className="flex items-center gap-4 flex-1">
                        <div className={`w-2 h-10 rounded-full ${task.priority === 'High' ? 'bg-red-400' : task.priority === 'Medium' ? 'bg-amber-400' : 'bg-blue-400'}`} />
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                {hasSubtasks && (
                                    isExpanded ? <FiChevronDown className="text-gray-400" /> : <FiChevronRight className="text-gray-400" />
                                )}
                                <h3 className="m-0 text-base font-bold text-gray-800 leading-tight group-hover:text-brand-primary transition-colors">
                                    {task.title}
                                </h3>
                            </div>
                            <div className="mt-2 flex items-center gap-4">
                                <div className="flex-1 max-w-[200px] h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-brand-primary transition-all duration-500"
                                        style={{ width: `${task.progress || 0}%` }}
                                    />
                                </div>
                                <span className="text-[10px] font-bold text-gray-400">{task.progress || 0}%</span>
                            </div>
                            <p className="m-0 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 flex items-center gap-3 flex-wrap">
                                <span className="flex items-center gap-1"><FiClock /> {new Date(task.createdAt).toLocaleDateString()}</span>
                                <span className="flex items-center gap-1"><FiFlag /> {task.priority}</span>
                                {task.assignedTo && <span className="flex items-center gap-1 text-brand-primary"><FiPlusCircle className="rotate-45" /> {task.assignedTo.name}</span>}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {!hasSubtasks && depth < 3 && (
                            <button
                                onClick={(e) => { e.stopPropagation(); handleCreateTask(task._id); }}
                                className="p-2 text-gray-300 hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-all"
                                title="Break down task"
                            >
                                <FiPlusCircle size={18} />
                            </button>
                        )}
                        <div className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5 ${statusColors[task.status] || 'bg-gray-100 text-gray-600'}`}>
                            {task.status === 'Completed' ? <FiCheckCircle /> : <FiClock />} {task.status}
                        </div>
                        {depth === 2 && ( // Employee level or lowest level can update progress directly
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={task.progress || 0}
                                onChange={(e) => updateTaskProgress(task._id, parseInt(e.target.value))}
                                onClick={(e) => e.stopPropagation()}
                                className="w-20 accent-brand-primary"
                            />
                        )}
                    </div>
                </div>
                {isExpanded && subtasks.length > 0 && (
                    <div className="bg-gray-50/30">
                        {subtasks.map(sub => (
                            <TaskItem key={sub._id} task={sub} depth={depth + 1} />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="p-7.5 max-w-[1200px] mx-auto min-h-[90vh]">
            {showForm && (
                <TaskForm
                    parentId={selectedParentId}
                    onClose={() => setShowForm(false)}
                    onSuccess={fetchTasks}
                />
            )}

            <div className="bg-gradient-to-r from-brand-primary to-brand-primary-dark text-white p-6.25 rounded-2xl shadow-lg mb-7.5 flex flex-col sm:flex-row justify-between items-center border-none">
                <div>
                    <h1 className="m-0 mb-1.5 text-3xl font-bold flex items-center gap-3">
                        <FiBarChart2 /> Task Flow
                    </h1>
                    <p className="m-0 opacity-80 text-sm">Hierarchical management & progress tracking</p>
                </div>
                <button
                    onClick={() => handleCreateTask()}
                    className="mt-4 sm:mt-0 bg-white/20 text-white border border-white/40 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-white/30 transition-all"
                >
                    <FiPlus /> New Global Task
                </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-5 mb-7.5 items-center justify-between">
                <div className="flex gap-2 p-1 bg-white rounded-2xl border border-gray-100 shadow-sm w-full sm:w-auto overflow-x-auto">
                    {['All', 'Pending', 'In Progress', 'Completed'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-[14px] font-bold text-[11px] uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-brand-primary text-white shadow-md' : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="relative w-full sm:w-64">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input className="w-full pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl outline-none focus:border-brand-primary shadow-sm text-sm" placeholder="Search tasks..." />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="text-center py-20 flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
                        <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">Loading Tasks...</span>
                    </div>
                ) : rootTasks.length === 0 ? (
                    <div className="text-center py-20 text-gray-300 italic">No tasks found in this category</div>
                ) : (
                    <div>
                        {rootTasks.map((task) => (
                            <TaskItem key={task._id} task={task} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskBoard;
