import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import patientRoutes from "./routes/patients.js";
import chatRoutes from "./routes/chat.js";

const app = express();

const configuredOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const defaultOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://dental-assistant-six.vercel.app",
];

const allowedOrigins = new Set([
  ...defaultOrigins,
  ...configuredOrigins,
]);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS not allowed for this origin"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({ status: "ok", service: "teraleads-backend" });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/favicon.ico", (_req, res) => {
  res.status(204).end();
});

app.use("/auth", authRoutes);
app.use("/patients", patientRoutes);
app.use("/chat", chatRoutes);

app.use((err, _req, res, _next) => {
  if (err?.code === "28P01") {
    return res.status(500).json({
      error: "Database authentication failed. Check DATABASE_URL credentials.",
    });
  }

  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Server error" });
});

export default app;
