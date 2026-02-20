import { useState, useEffect } from "react";
import { api } from "../api";

export const useChat = (selectedPatient) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [loadingChat, setLoadingChat] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (selectedPatient) {
      api
        .getChatHistory(selectedPatient.id)
        .then((data) => setChatMessages(data.messages))
        .catch((err) => setError(err.message));
    }
  }, [selectedPatient]);

  const handleSend = async (message) => {
    if (!selectedPatient) return;
    setLoadingChat(true);
    try {
      const data = await api.sendChat({
        patientId: selectedPatient.id,
        message,
      });
      setChatMessages((prev) => [...prev, ...data.messages]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingChat(false);
    }
  };

  return {
    chatMessages,
    loadingChat,
    handleSend,
    error,
    setError,
  };
};