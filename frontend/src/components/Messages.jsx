import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

function Messages() {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const messagesEndRef = useRef(null);

  /* ================= FETCH USERS ================= */
  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================= FETCH MESSAGES (POLLING) ================= */
  useEffect(() => {
    if (!selectedUser) return;

    fetchMessages(selectedUser._id);

    const intervalId = setInterval(() => {
      fetchMessages(selectedUser._id);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [selectedUser]);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /* ================= API CALLS ================= */
  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/messages/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const res = await axios.get(`/api/messages/${userId}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages", err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const res = await axios.post("/api/messages", {
        recipient: selectedUser._id,
        content: newMessage,
      });

      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message", err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  /* ================= UI ================= */
  return (
    <div
      style={{
        display: "flex",
        height: "90vh",
        marginLeft: "50px",
        backgroundColor: "#f4f6f8",
      }}
    >
      {/* ================= USERS LIST ================= */}
      <div
        style={{
          width: "300px",
          backgroundColor: "#fff",
          borderRight: "1px solid #ddd",
          overflowY: "auto",
        }}
      >
        <h2 style={{ padding: "15px", borderBottom: "1px solid #ddd" }}>
          Messages
        </h2>

        {users.length === 0 && (
          <p style={{ padding: "10px", color: "#777" }}>No users found</p>
        )}

        {users.map((u) => (
          <div
            key={u._id}
            onClick={() => setSelectedUser(u)}
            style={{
              padding: "12px",
              cursor: "pointer",
              backgroundColor:
                selectedUser?._id === u._id ? "#eef2f7" : "#fff",
              borderBottom: "1px solid #eee",
            }}
          >
            {u.name}
          </div>
        ))}
      </div>

      {/* ================= CHAT AREA ================= */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {selectedUser ? (
          <>
            {/* HEADER */}
            <div
              style={{
                padding: "15px",
                borderBottom: "1px solid #ddd",
                backgroundColor: "#fff",
                fontWeight: "bold",
              }}
            >
              {selectedUser.name}
            </div>

            {/* MESSAGES */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "20px",
              }}
            >
              {messages.length === 0 && (
                <p style={{ textAlign: "center", color: "#777" }}>
                  No messages yet
                </p>
              )}

              {messages.map((msg) => (
                <div
                  key={msg._id}
                  style={{
                    textAlign:
                      msg.sender === currentUser._id ? "right" : "left",
                    marginBottom: "8px",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      padding: "8px 12px",
                      borderRadius: "10px",
                      backgroundColor:
                        msg.sender === currentUser._id
                          ? "#daf8cb"
                          : "#fff",
                      maxWidth: "70%",
                    }}
                  >
                    {msg.content}
                  </span>
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <form
              onSubmit={sendMessage}
              style={{
                display: "flex",
                padding: "15px",
                backgroundColor: "#fff",
                borderTop: "1px solid #ddd",
              }}
            >
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  outline: "none",
                }}
              />
              <button
                type="submit"
                style={{
                  marginLeft: "10px",
                  padding: "10px 20px",
                  border: "none",
                  backgroundColor: "#4f46e5",
                  color: "#fff",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#777",
            }}
          >
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;
