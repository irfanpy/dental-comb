import { register, login } from "./auth.js";
import { listPatients, createPatient, updatePatient, deletePatient } from "./patients.js";
import { getChatHistory, sendChat } from "./chat.js";

export const api = {
  register,
  login,
  listPatients,
  createPatient,
  updatePatient,
  deletePatient,
  getChatHistory,
  sendChat,
};