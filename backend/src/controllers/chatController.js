import { query } from "../db/index.js";
import { chatSchema } from "../validators/chat.js";
import { generateReply } from "../services/aiService.js";

const mapChat = (row) => ({
  id: row.id,
  patientId: row.patient_id,
  role: row.role,
  message: row.message,
  createdAt: row.created_at,
});

export const sendChat = async (req, res) => {
  const parsed = chatSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const { patientId, message } = parsed.data;
  const patientResult = await query(
    "SELECT * FROM patients WHERE id = $1 AND user_id = $2",
    [patientId, req.user.id]
  );

  if (patientResult.rowCount === 0) {
    return res.status(404).json({ error: "Patient not found" });
  }

  const patient = patientResult.rows[0];

  const userChatResult = await query(
    `INSERT INTO chats (user_id, patient_id, role, message)
     VALUES ($1, $2, 'user', $3)
     RETURNING *`,
    [req.user.id, patientId, message]
  );

  const reply = await generateReply({
    message,
    patient: {
      id: patient.id,
      name: patient.name,
      dob: patient.dob,
      medicalNotes: patient.medical_notes,
    },
  });

  const assistantChatResult = await query(
    `INSERT INTO chats (user_id, patient_id, role, message)
     VALUES ($1, $2, 'assistant', $3)
     RETURNING *`,
    [req.user.id, patientId, reply]
  );

  return res.json({
    reply,
    messages: [
      mapChat(userChatResult.rows[0]),
      mapChat(assistantChatResult.rows[0]),
    ],
  });
};

export const getChatHistory = async (req, res) => {
  const patientId = req.params.id;
  const patientResult = await query(
    "SELECT id FROM patients WHERE id = $1 AND user_id = $2",
    [patientId, req.user.id]
  );

  if (patientResult.rowCount === 0) {
    return res.status(404).json({ error: "Patient not found" });
  }

  const result = await query(
    `SELECT * FROM chats
     WHERE user_id = $1 AND patient_id = $2
     ORDER BY created_at ASC`,
    [req.user.id, patientId]
  );

  return res.json({ messages: result.rows.map(mapChat) });
};
