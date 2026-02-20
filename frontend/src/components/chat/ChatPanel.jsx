import React, { useState } from "react";

const ChatPanel = ({ patient, messages, onSend, loading }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="card chat">
      <div className="card-header">
        <h3>Chat</h3>
        {patient && <span className="badge">{patient.name}</span>}
      </div>
      <div className="chat-history">
        {messages.length === 0 && (
          <p className="muted">Select a patient to view chat history.</p>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={msg.role === "assistant" ? "chat-bubble bot" : "chat-bubble"}
          >
            <div className="chat-role">{msg.role}</div>
            <div>{msg.message}</div>
          </div>
        ))}
        {loading && <div className="chat-bubble bot">Typing...</div>}
      </div>
      <form className="chat-input" onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask a dental question..."
          disabled={!patient}
        />
        <button type="submit" className="primary" disabled={!patient || loading}>
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;
