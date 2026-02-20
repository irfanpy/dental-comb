import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../db/index.js";
import { registerSchema, loginSchema } from "../validators/auth.js";

const createToken = (user) =>
  jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
    subject: user.id,
    expiresIn: "7d",
  });

export const register = async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    const message = parsed.error.errors?.[0]?.message || "Invalid input";
    return res.status(400).json({ error: message });
  }

  const { email, password } = parsed.data;
  const existing = await query("SELECT id FROM users WHERE email = $1", [email]);
  if (existing.rowCount > 0) {
    return res.status(409).json({ error: "Email already registered" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const result = await query(
    "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email",
    [email, passwordHash]
  );

  const user = result.rows[0];
  const token = createToken(user);
  return res.status(201).json({ token, user });
};

export const login = async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    const message = parsed.error.errors?.[0]?.message || "Invalid input";
    return res.status(400).json({ error: message });
  }

  const { email, password } = parsed.data;
  const result = await query(
    "SELECT id, email, password_hash FROM users WHERE email = $1",
    [email]
  );

  if (result.rowCount === 0) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const user = result.rows[0];
  const matches = await bcrypt.compare(password, user.password_hash);
  if (!matches) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = createToken({ id: user.id, email: user.email });
  return res.json({ token, user: { id: user.id, email: user.email } });
};
