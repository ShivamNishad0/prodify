import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaTrash } from "react-icons/fa";


function Notes() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ content: "", color: "#fff740" });
  const [isAdding, setIsAdding] = useState(false);

  const colors = ["#fff740", "#ff7eb9", "#7afcff", "#feff9c", "#ffffff"];


  const fetchNotes = async () => {
    try {
      const res = await axios.get("/api/notes");
      setNotes(res.data);
    } catch (err) {
      console.error("Error fetching notes", err);
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
      setNewNote({ content: "", color: "#fff740" });
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

  return (
    <div
      style={{
        padding: "20px",
        marginLeft: "50px",
        minHeight: "90vh",
        backgroundColor: "#f4f6f8",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>Sticky Notes</h1>

        <button
          onClick={() => setIsAdding(!isAdding)}
          style={{
            backgroundColor: "#222",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <FaPlus /> Add Note
        </button>
      </div>

      {/* ADD NOTE */}
      {isAdding && (
        <div
          style={{
            marginBottom: "20px",
            padding: "15px",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <textarea
            value={newNote.content}
            onChange={(e) =>
              setNewNote({ ...newNote, content: e.target.value })
            }
            placeholder="Write your note here..."
            style={{
              width: "100%",
              height: "80px",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
              resize: "none",
            }}
          />

          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
            }}
          >
            {colors.map((c) => (
              <div
                key={c}
                onClick={() => setNewNote({ ...newNote, color: c })}
                style={{
                  width: "25px",
                  height: "25px",
                  borderRadius: "50%",
                  backgroundColor: c,
                  cursor: "pointer",
                  border:
                    newNote.color === c
                      ? "2px solid #222"
                      : "1px solid #ddd",
                }}
              />
            ))}


            <button
              onClick={addNote}
              style={{
                marginLeft: "auto",
                padding: "8px 16px",
                backgroundColor: "#3cb2a8",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Save
            </button>
            <button
              onClick={() => {
                setNewNote({ content: "", color: "#fff740" });
                setIsAdding(false);
              }}
              style={{
                marginLeft: "10px",
                padding: "8px 16px",
                backgroundColor: "#e74c3c",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* NOTES GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {notes.length === 0 && (
          <p style={{ color: "#777" }}>No notes yet</p>
        )}

        {notes.map((note) => (
          <div
            key={note._id}
            style={{
              backgroundColor: note.color,
              padding: "20px",
              borderRadius: "5px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              minHeight: "150px",
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            <div style={{ flex: 1, whiteSpace: "pre-wrap" }}>
              {note.content}
            </div>

            <button
              onClick={() => deleteNote(note._id)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#555",
              }}
            >
              <FaTrash />
            </button>

            <div
              style={{
                fontSize: "12px",
                color: "#666",
                marginTop: "10px",
                textAlign: "right",
              }}
            >
              {new Date(note.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notes;
