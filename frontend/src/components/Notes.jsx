import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiPlus, FiTrash2, FiTag, FiClock, FiX, FiCheck } from "react-icons/fi";

function Notes() {
  const [notes, setNotes] = useState([]);
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
      const res = await axios.get("/api/notes");
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
      const res = await axios.post("/api/notes", newNote);
      setNotes((prev) => [res.data, ...prev]);
      setNewNote({ content: "", color: "#fff3bf" });
      setIsAdding(false);
    } catch (err) {
      console.error("Error adding note", err);
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`/api/notes/${id}`);
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Error deleting note", err);
    }
  };

  const containerStyle = {
    padding: '30px',
    maxWidth: '1400px',
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

  const noteStyle = (color) => ({
    backgroundColor: color,
    padding: "25px",
    borderRadius: "15px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
    minHeight: "200px",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    border: "1px solid rgba(0,0,0,0.05)",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "default"
  });

  return (
    <div style={containerStyle}>
      {/* Header Section */}
      <div style={{
        ...cardStyle,
        background: 'linear-gradient(135deg, #3cb2a8 0%, #2a8a81 100%)',
        color: 'white',
        border: 'none',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <div>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '32px' }}>Sticky Notes</h1>
          <p style={{ margin: '0', opacity: '0.9' }}>Capture your thoughts and tasks instantly</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: '1px solid white',
            padding: '12px 24px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.2s'
          }}
        >
          {isAdding ? <FiX size={18} /> : <FiPlus size={18} />} {isAdding ? "Cancel" : "New Note"}
        </button>
      </div>

      {/* New Note Form */}
      {isAdding && (
        <div style={{ ...cardStyle, animation: 'slideDown 0.3s ease-out' }}>
          <textarea
            value={newNote.content}
            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            placeholder="What's on your mind?..."
            style={{
              width: "100%",
              height: "120px",
              padding: "15px",
              marginBottom: "20px",
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
              fontSize: "16px",
              resize: "none",
              outline: "none",
              boxSizing: "border-box"
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              {colors.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => setNewNote({ ...newNote, color: c.hex })}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: c.hex,
                    cursor: "pointer",
                    border: newNote.color === c.hex ? "3px solid #3cb2a8" : "1px solid #e2e8f0",
                    padding: 0
                  }}
                  title={c.name}
                />
              ))}
            </div>
            <button
              onClick={addNote}
              disabled={!newNote.content.trim()}
              style={{
                backgroundColor: "#3cb2a8",
                color: "white",
                border: "none",
                padding: "10px 25px",
                borderRadius: "8px",
                fontWeight: "700",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                opacity: !newNote.content.trim() ? 0.6 : 1
              }}
            >
              <FiCheck /> Save Note
            </button>
          </div>
        </div>
      )}

      {/* Notes Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>
          <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #3cb2a8', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
          <p>Loading your notes...</p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "25px"
        }}>
          {notes.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px 0', color: '#94a3b8' }}>
              <FiTag size={48} style={{ marginBottom: '15px', opacity: 0.3 }} />
              <h3>No notes yet</h3>
              <p>Click the "New Note" button to start capturing your ideas.</p>
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note._id}
                style={noteStyle(note.color)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
                }}
              >
                <div style={{ flex: 1, fontSize: "16px", color: "#444", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>
                  {note.content}
                </div>

                <div style={{
                  marginTop: "20px",
                  paddingTop: "15px",
                  borderTop: "1px solid rgba(0,0,0,0.05)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "12px",
                  color: "#64748b"
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <FiClock size={12} /> {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => deleteNote(note._id)}
                    style={{
                      background: "rgba(255,255,255,0.5)",
                      border: "none",
                      padding: "8px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      color: "#ef4444",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#fee2e2"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.5)"}
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default Notes;

