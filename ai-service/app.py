from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
import random

load_dotenv()

app = Flask(__name__)

# Mock responses for different dental topics
MOCK_RESPONSES = {
    "root canal": "A root canal is a procedure to treat a decayed or infected tooth. The dentist removes the pulp (nerve) from inside the tooth and fills it with a special material. This helps save your tooth and prevent extraction. It typically takes 1-2 appointments and you may experience some sensitivity afterward.",
    "cleaning": "Regular dental cleanings are essential for removing plaque and tartar buildup that brushing alone cannot remove. We recommend professional cleanings every 6 months for most patients. This helps prevent gum disease and cavities. Our team will also check for any signs of dental problems during the visit.",
    "cavity": "A cavity is a hole in your tooth caused by decay. If detected early, we can treat it with a simple filling. To prevent cavities, brush twice daily with fluoride toothpaste, floss daily, and limit sugary foods and drinks. If left untreated, cavities can lead to more serious problems.",
    "whitening": "Teeth whitening can be done in-office or with custom trays at home. Professional whitening is more effective than over-the-counter products and typically shows results within 1-2 weeks. Results usually last 6-12 months depending on your habits. Avoid staining foods and beverages for best results.",
    "braces": "Braces are used to straighten misaligned teeth and correct bite issues. Modern braces are more comfortable and less visible than ever. Treatment typically lasts 18-36 months depending on your specific case. Regular adjustments every 4-6 weeks are needed to gradually move your teeth into position.",
    "implant": "A dental implant is an artificial tooth root that supports a replacement tooth. It's a permanent solution for missing teeth and looks and feels like a natural tooth. The procedure involves surgical placement of the implant and typically requires 3-6 months of healing before the crown is placed.",
    "extraction": "A tooth extraction removes a tooth that is severely decayed, damaged, or infected. After extraction, we can discuss replacement options like implants, bridges, or dentures. Recovery typically takes 7-10 days, and you should avoid strenuous activity during this time.",
    "sensitivity": "Tooth sensitivity is usually caused by exposed tooth roots due to gum recession or worn enamel. It can be managed with desensitizing toothpaste, a softer toothbrush, and fluoride gel. If sensitivity persists, we may recommend a gum graft or root canal depending on the cause.",
    "gum disease": "Gum disease ranges from gingivitis (inflammation) to periodontitis (more severe). Early stages can be reversed with improved oral hygiene and professional cleaning. Advanced cases may require specialized treatment. Regular checkups help us catch gum disease early."
}

DEFAULT_REPLY = (
    "Thanks for your question. Our dental team recommends scheduling an appointment with us "
    "for a personalized assessment and treatment plan tailored to your needs."
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/generate")
def generate():
    print("AI is generating a mock response...")
    payload = request.get_json(silent=True) or {}
    message = payload.get("message", "").strip().lower()
    patient = payload.get("patient") or {}
    
    if not message:
        return jsonify({"error": "Message required"}), 400

    # Find matching response based on keywords in the message
    reply = DEFAULT_REPLY
    for topic, response in MOCK_RESPONSES.items():
        if topic in message:
            reply = response
            break
    
    # If no match found, use a generic response
    if reply == DEFAULT_REPLY:
        generic_replies = [
            "That's a great question about your dental health. I recommend scheduling a consultation with our dentist to discuss your specific concerns in detail.",
            "Thank you for asking. Our dental professionals are here to help. Please book an appointment so we can provide you with personalized advice.",
            "I appreciate your interest in learning about dental care. For the most accurate information regarding your situation, please visit us for a professional evaluation.",
        ]
        reply = random.choice(generic_replies)
    
    name = patient.get("name")
    greeting = f"Hi {name}, " if name else "Hi, "
    
    return jsonify({
        "reply": greeting + reply,
        "source": "mock",
        "model": "mock-dental-assistant"
    })

if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    app.run(host="0.0.0.0", port=port)
