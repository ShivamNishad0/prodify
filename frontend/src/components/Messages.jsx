import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

function Messages() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef(null);

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
      const res = await axios.get("/api/messages/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const res = await axios.get(`/api/messages/${userId}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Error:", err);
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
      console.error("Error:", err);
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <div style={{
        display: "flex",
        height: "calc(100vh - 100px)",
        backgroundColor: "#fff",
        borderRadius: "15px",
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        border: "1px solid #e0e0e0"
      }}>
        {/* Sidebar */}
        <div style={{
          width: "320px",
          borderRight: "1px solid #e0e0e0",
          display: "flex",
          flexDirection: "column"
        }}>
          <div style={{
            padding: "20px",
            background: "linear-gradient(135deg, #3cb2a8 0%, #2a8a81 100%)",
            color: "white"
          }}>
            <h2 style={{ margin: "0 0 5px 0", fontSize: "22px" }}>Messages</h2>
            <p style={{ margin: 0, opacity: 0.9, fontSize: "13px" }}>{users.length} users</p>
          </div>

          <input
            type="text"
            placeholder="🔍 Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              margin: "15px",
              padding: "10px",
              border: "2px solid #e0e0e0",
              borderRadius: "8px",
              outline: "none"
            }}
          />

          <div style={{ flex: 1, overflowY: "auto" }}>
            {loading ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>Loading...</div>
            ) : filteredUsers.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>No users</div>
            ) : (
              filteredUsers.map((u) => (
                <div
                  key={u._id}
                  onClick={() => setSelectedUser(u)}
                  style={{
                    padding: "15px 20px",
                    cursor: "pointer",
                    backgroundColor: selectedUser?._id === u._id ? "#e8f5e9" : "#fff",
                    borderBottom: "1px solid #f0f0f0",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px"
                  }}
                >
                  <div style={{
                    width: "35px",
                    height: "35px",
                    borderRadius: "50%",
                    backgroundColor: "#3cb2a8",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "600"
                  }}>
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ fontWeight: "600", fontSize: "15px" }}>{u.name}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {selectedUser ? (
            <>
              <div style={{
                padding: "20px",
                borderBottom: "2px solid #e0e0e0",
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: "#3cb2a8",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "600"
                }}>
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ fontWeight: "600", fontSize: "18px" }}>{selectedUser.name}</div>
              </div>

              <div style={{ flex: 1, overflowY: "auto", padding: "20px", backgroundColor: "#f8f9fa" }}>
                {messages.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px", color: "#999" }}>
                    <div style={{ fontSize: "48px" }}>💬</div>
                    <p>No messages yet</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg._id}
                      style={{
                        display: "flex",
                        justifyContent: msg.sender === currentUser._id ? "flex-end" : "flex-start",
                        marginBottom: "12px"
                      }}
                    >
                      <div style={{
                        maxWidth: "70%",
                        padding: "12px 16px",
                        borderRadius: msg.sender === currentUser._id ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                        backgroundColor: msg.sender === currentUser._id ? "#3cb2a8" : "#fff",
                        color: msg.sender === currentUser._id ? "#fff" : "#333",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                      }}>
                        {msg.content}
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={sendMessage} style={{
                display: "flex",
                padding: "20px",
                borderTop: "2px solid #e0e0e0",
                gap: "15px"
              }}>
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type message..."
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    borderRadius: "25px",
                    border: "2px solid #e0e0e0",
                    outline: "none"
                  }}
                />
                <button type="submit" style={{
                  padding: "12px 30px",
                  border: "none",
                  backgroundColor: "#3cb2a8",
                  color: "#fff",
                  borderRadius: "25px",
                  cursor: "pointer",
                  fontWeight: "600"
                }}>
                  Send
                </button>
              </form>
            </>
          ) : (
            <div style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#999"
            }}>
              <div style={{ fontSize: "64px" }}></div>
              <h3>Select a conversation</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messages;