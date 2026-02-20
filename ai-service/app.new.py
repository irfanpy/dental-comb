from flask import Flask, request, jsonify
from dotenv import load_dotenv
from openai import OpenAI
import os

load_dotenv()

app = Flask(__name__)

DEFAULT_REPLY = (
    "Thanks for your question. For dental concerns, we recommend scheduling "
    "an appointment for a personalized assessment."
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/generate")
def generate():
    payload = request.get_json(silent=True) or {}
    message = payload.get("message", "").strip()
    patient = payload.get("patient") or {}

    if not message:
        return jsonify({"error": "Message required"}), 400

    prompt_template = os.getenv(
        "PROMPT_TEMPLATE",
        "You are a helpful dental assistant. Patient question: {message}. Provide a professional response.",
    )

    prompt = prompt_template.format(message=message)
    name = patient.get("name")
    if name:
        prompt = f"Patient name: {name}. " + prompt

    try:
        api_key = os.getenv("OPENROUTER_API_KEY")
        if not api_key:
            return jsonify({"reply": DEFAULT_REPLY, "prompt": prompt, "source": "mock"})

        model = os.getenv("OPENROUTER_MODEL", "openai/gpt-4o-mini")
        site_url = os.getenv("OPENROUTER_SITE_URL", "http://localhost:5173")
        app_name = os.getenv("OPENROUTER_APP_NAME", "Teraleads Dental Assistant")

        client = OpenAI(
            api_key=api_key,
            base_url="https://openrouter.ai/api/v1",
            default_headers={
                "HTTP-Referer": site_url,
                "X-Title": app_name,
            },
        )

        response = client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful dental assistant. Keep responses concise and professional.",
                },
                {"role": "user", "content": prompt},
            ],
            max_tokens=300,
            temperature=0.7,
        )

        reply = (response.choices[0].message.content or "").strip() or DEFAULT_REPLY
        return jsonify({"reply": reply, "prompt": prompt, "source": "openrouter", "model": model})
    except Exception as err:
        print(f"OpenRouter error: {err}")
        return jsonify({"reply": DEFAULT_REPLY, "prompt": prompt, "source": "fallback"})

if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    app.run(host="0.0.0.0", port=port)
