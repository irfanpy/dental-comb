const DEFAULT_REPLY =
  "Thanks for your question. Our dental team recommends scheduling a check-up for a personalized assessment.";

export const generateReply = async ({ message, patient }) => {
  const serviceUrl = process.env.AI_SERVICE_URL;
  if (!serviceUrl) {
    return DEFAULT_REPLY;
  }

  const timeoutMs = parseInt(process.env.AI_SERVICE_TIMEOUT_MS || "5000", 10);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${serviceUrl}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, patient }),
      signal: controller.signal,
    });

    if (!response.ok) {
      return DEFAULT_REPLY;
    }

    const data = await response.json();
    return data.reply || DEFAULT_REPLY;
  } catch (err) {
    return DEFAULT_REPLY;
  } finally {
    clearTimeout(timer);
  }
};
