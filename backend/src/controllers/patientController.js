import { query } from "../db/index.js";
import {
  patientCreateSchema,
  patientUpdateSchema,
} from "../validators/patients.js";

const mapPatient = (row) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  phone: row.phone,
  dob: row.dob,
  medicalNotes: row.medical_notes,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const createPatient = async (req, res) => {
  const parsed = patientCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const { name, email, phone, dob, medicalNotes } = parsed.data;
  const result = await query(
    `INSERT INTO patients (user_id, name, email, phone, dob, medical_notes)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [req.user.id, name, email, phone, dob, medicalNotes]
  );

  return res.status(201).json({ patient: mapPatient(result.rows[0]) });
};

export const listPatients = async (req, res) => {
  const page = Math.max(parseInt(req.query.page || "1", 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || "10", 10), 1), 50);
  const offset = (page - 1) * limit;

  const countResult = await query(
    "SELECT COUNT(*) FROM patients WHERE user_id = $1",
    [req.user.id]
  );
  const total = parseInt(countResult.rows[0].count, 10);

  const result = await query(
    `SELECT * FROM patients
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
    [req.user.id, limit, offset]
  );

  return res.json({
    data: result.rows.map(mapPatient),
    pagination: { page, limit, total },
  });
};

export const getPatient = async (req, res) => {
  const result = await query(
    "SELECT * FROM patients WHERE id = $1 AND user_id = $2",
    [req.params.id, req.user.id]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ error: "Patient not found" });
  }

  return res.json({ patient: mapPatient(result.rows[0]) });
};

export const updatePatient = async (req, res) => {
  const parsed = patientUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const fields = parsed.data;
  if (Object.keys(fields).length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }

  const result = await query(
    `UPDATE patients
     SET name = COALESCE($1, name),
         email = COALESCE($2, email),
         phone = COALESCE($3, phone),
         dob = COALESCE($4, dob),
         medical_notes = COALESCE($5, medical_notes),
         updated_at = NOW()
     WHERE id = $6 AND user_id = $7
     RETURNING *`,
    [
      fields.name ?? null,
      fields.email ?? null,
      fields.phone ?? null,
      fields.dob ?? null,
      fields.medicalNotes ?? null,
      req.params.id,
      req.user.id,
    ]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ error: "Patient not found" });
  }

  return res.json({ patient: mapPatient(result.rows[0]) });
};

export const deletePatient = async (req, res) => {
  const result = await query(
    "DELETE FROM patients WHERE id = $1 AND user_id = $2 RETURNING id",
    [req.params.id, req.user.id]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ error: "Patient not found" });
  }

  return res.status(204).send();
};
