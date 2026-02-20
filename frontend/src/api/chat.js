import { getHeaders, handleResponse } from "./base.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export const getChatHistory = (patientId) =>
  fetch(`${API_URL}/chat/patients/${patientId}`, {
    headers: getHeaders(),
  }).then(handleResponse);

export const sendChat = (payload) =>
  fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  }).then(handleResponse);