import { getHeaders, handleResponse } from "./base.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export const listPatients = (page, limit) =>
  fetch(`${API_URL}/patients?page=${page}&limit=${limit}`, {
    headers: getHeaders(),
  }).then(handleResponse);

export const createPatient = (payload) =>
  fetch(`${API_URL}/patients`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  }).then(handleResponse);

export const updatePatient = (id, payload) =>
  fetch(`${API_URL}/patients/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  }).then(handleResponse);

export const deletePatient = (id) =>
  fetch(`${API_URL}/patients/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  }).then((res) => {
    if (!res.ok && res.status !== 204) {
      throw new Error("Delete failed");
    }
    return true;
  });