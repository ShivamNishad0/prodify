'use client';

import React, { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiTag, FiClock, FiX, FiCheck } from "react-icons/fi";
import apiClient from "@/core/api/client";

const NotesGrid = () => {
    const [notes, setNotes] = useState<any[]>([]);
    const [newNote, setNewNote] = useState({ content: "", color: "#fff3bf" });
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(true);

    const colors = [
        { name: 'Yellow', hex: "#fff3bf" },
        { name: 'Pink', hex: "#ffdeeb" },
        { name: 'Blue', hex: "#d0ebff" },
        { name: 'Green', hex: "#d3f9d8" },
        { name: 'Purple', hex: "#f3d9fa" }
    ];

    const fetchNotes = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get("/notes");
            setNotes(res.data);
        } catch (err) {
            console.error("Error fetching notes", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const addNote = async () => {
        if (!newNote.content.trim()) return;

        try {
            const res = await apiClient.post("/notes", newNote);
            setNotes((prev) => [res.data, ...prev]);
            setNewNote({ content: "", color: "#fff3bf" });
            setIsAdding(false);
        } catch (err) {
            console.error("Error adding note", err);
        }
    };

    const deleteNote = async (id: string) => {
        try {
            await apiClient.delete(`/notes/${id}`);
            setNotes((prev) => prev.filter((n) => n._id !== id));
        } catch (err) {
            console.error("Error deleting note", err);
        }
    };

    return (
        <div className="p-7.5 max-w-[1400px] mx-auto min-h-[90vh]">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-brand-primary to-brand-primary-dark text-white p-6.25 rounded-[15px] shadow-lg mb-7.5 flex justify-between items-center border-none">
                <div>
                    <h1 className="m-0 mb-2 text-[32px] font-bold">Sticky Notes</h1>
                    <p className="m-0 opacity-90">Capture your thoughts and tasks instantly</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="bg-white/20 text-white border border-white px-6 py-3 rounded-xl cursor-pointer font-bold flex items-center gap-2.5 transition-all hover:bg-white/30"
                >
                    {isAdding ? <FiX size={18} /> : <FiPlus size={18} />} {isAdding ? "Cancel" : "New Note"}
                </button>
            </div>

            {/* New Note Form */}
            {isAdding && (
                <div className="bg-white rounded-[15px] p-6.25 shadow-md border border-gray-100 mb-7.5 animate-in fade-in slide-in-from-top-4 duration-300">
                    <textarea
                        value={newNote.content}
                        onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                        placeholder="What's on your mind?..."
                        className="w-full h-32 p-[15px] mb-5 rounded-xl border border-gray-100 text-lg resize-none outline-none focus:border-brand-primary transition-colors"
                    />
                    <div className="flex justify-between items-center">
                        <div className="flex gap-3">
                            {colors.map((c) => (
                                <button
                                    key={c.hex}
                                    onClick={() => setNewNote({ ...newNote, color: c.hex })}
                                    className={`w-8 h-8 rounded-full cursor-pointer transition-all ${newNote.color === c.hex ? "ring-2 ring-brand-primary ring-offset-2 scale-110" : "border border-gray-200"
                                        }`}
                                    style={{ backgroundColor: c.hex }}
                                    title={c.name}
                                />
                            ))}
                        </div>
                        <button
                            onClick={addNote}
                            disabled={!newNote.content.trim()}
                            className={`px-7.5 py-3 bg-brand-primary text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-brand-primary-dark/20 transition-all ${!newNote.content.trim() ? "opacity-50 cursor-not-allowed" : "hover:bg-brand-primary-dark"
                                }`}
                        >
                            <FiCheck /> Save Note
                        </button>
                    </div>
                </div>
            )}

            {/* Notes Grid */}
            {loading ? (
                <div className="text-center py-20 text-gray-400">
                    <div className="w-10 h-10 border-4 border-gray-100 border-t-brand-primary rounded-full animate-spin mx-auto mb-5"></div>
                    <p>Loading your notes...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6.25">
                    {notes.length === 0 ? (
                        <div className="col-span-full text-center py-24 text-gray-300">
                            <FiTag size={64} className="mx-auto mb-4 opacity-10" />
                            <h3 className="text-xl font-bold">No notes yet</h3>
                            <p className="max-w-[300px] mx-auto opacity-50">Click the "New Note" button to start capturing your ideas.</p>
                        </div>
                    ) : (
                        notes.map((note) => (
                            <div
                                key={note._id}
                                className="p-6.25 rounded-2xl shadow-sm min-h-[220px] flex flex-col relative border border-gray-100/10 transition-all hover:-translate-y-1 hover:shadow-lg group"
                                style={{ backgroundColor: note.color }}
                            >
                                <div className="flex-1 text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">
                                    {note.content}
                                </div>

                                <div className="mt-5 pt-4 border-t border-black/5 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-black/30">
                                    <span className="flex items-center gap-1.5">
                                        <FiClock size={12} /> {new Date(note.createdAt).toLocaleDateString()}
                                    </span>
                                    <button
                                        onClick={() => deleteNote(note._id)}
                                        className="bg-black/5 border-none p-2 rounded-lg cursor-pointer text-red-500/60 hover:text-red-500 hover:bg-black/10 transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default NotesGrid;
