"""
Flask Backend for AI-Powered Intelligent Email Security & Assistant System
"""

import os
import sys
from flask import Flask, request, jsonify
from flask_cors import CORS
from ai_engine import AIEmailEngine
from imap_service import fetch_imap_emails, detect_imap_server
from mock_data import DEMO_EMAILS

app = Flask(__name__)
# Enable CORS for React frontend (Vite default port 5173 / any local port)
CORS(app, resources={r"/api/*": {"origins": "*"}})

ai_engine = AIEmailEngine()

# In-memory store for currently active loaded emails & analytics
CURRENT_SESSION = {
    "account": "demo-sandbox@security.ai",
    "is_demo": True,
    "emails": []
}

def compute_dashboard_stats(emails):
    """Computes real-time statistics for the dashboard view."""
    total = len(emails)
    if total == 0:
        return {
            "total_emails": 0,
            "spam_count": 0,
            "clean_count": 0,
            "spam_percentage": 0,
            "average_risk_score": 0,
            "category_distribution": {},
            "threat_levels": {"Critical Threat": 0, "High Risk": 0, "Moderate": 0, "Safe": 0},
            "language_distribution": {},
            "security_health_score": 100
        }

    spam_count = sum(1 for e in emails if e.get("security", {}).get("is_spam", False))
    clean_count = total - spam_count
    spam_pct = round((spam_count / total) * 100, 1)

    avg_risk = round(sum(e.get("security", {}).get("risk_score", 0) for e in emails) / total, 1)

    # Categories
    category_distribution = {
        "Clean / Safe": 0,
        "Advertisement Spam": 0,
        "Phishing Spam": 0,
        "Financial Scam": 0,
        "Job Spam": 0,
        "Lottery/Prize Spam": 0,
        "Malicious Link Spam": 0,
        "Other Spam": 0
    }
    
    threat_levels = {
        "Critical Threat": 0,
        "High Risk": 0,
        "Moderate": 0,
        "Safe": 0
    }

    language_distribution = {}

    for e in emails:
        sec = e.get("security", {})
        cat = sec.get("category", "Clean / Safe")
        category_distribution[cat] = category_distribution.get(cat, 0) + 1

        risk = sec.get("risk_score", 0)
        if not sec.get("is_spam", False):
            threat_levels["Safe"] += 1
        elif risk >= 75:
            threat_levels["Critical Threat"] += 1
        elif risk >= 50:
            threat_levels["High Risk"] += 1
        else:
            threat_levels["Moderate"] += 1

        lang_name = e.get("language", {}).get("name", "English")
        language_distribution[lang_name] = language_distribution.get(lang_name, 0) + 1

    # Security Health Score (0-100, where 100 means high awareness & clean filtering)
    security_health_score = max(10, min(100, int(100 - (avg_risk * 0.7))))

    return {
        "total_emails": total,
        "spam_count": spam_count,
        "clean_count": clean_count,
        "spam_percentage": spam_pct,
        "average_risk_score": avg_risk,
        "category_distribution": category_distribution,
        "threat_levels": threat_levels,
        "language_distribution": language_distribution,
        "security_health_score": security_health_score
    }

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        "status": "online",
        "service": "AI Email Security & Assistant Backend",
        "version": "1.0.0"
    })

@app.route('/api/fetch-demo', methods=['POST'])
def fetch_demo():
    """Loads demo emails for instant sandbox mode testing."""
    analyzed_emails = []
    for raw in DEMO_EMAILS:
        processed = ai_engine.full_pipeline_process(raw)
        analyzed_emails.append(processed)

    CURRENT_SESSION["account"] = "demo-sandbox@security.ai"
    CURRENT_SESSION["is_demo"] = True
    CURRENT_SESSION["emails"] = analyzed_emails

    stats = compute_dashboard_stats(analyzed_emails)
    return jsonify({
        "success": True,
        "account": CURRENT_SESSION["account"],
        "is_demo": True,
        "emails": analyzed_emails,
        "stats": stats
    })

@app.route('/api/connect', methods=['POST'])
def connect_imap():
    """
    Connects to user's real email via IMAP, fetches messages, and runs complete AI pipeline.
    """
    data = request.json or {}
    email_addr = data.get("email", "").strip()
    password = data.get("password", "").strip()
    server_host = data.get("server_host", "").strip()
    port = data.get("port", 993)
    limit_req = data.get("limit", 25)
    limit = None if (limit_req == "all" or limit_req == 0) else min(100, max(5, int(limit_req)))
    folder = data.get("folder", "INBOX")

    if not email_addr or not password:
        return jsonify({
            "success": False,
            "error": "Email address and password (or App Password) are required."
        }), 400

    try:
        raw_emails = fetch_imap_emails(
            email_address=email_addr,
            password=password,
            server_host=server_host or None,
            port=port,
            limit=limit,
            folder=folder
        )

        if not raw_emails:
            return jsonify({
                "success": True,
                "message": "Connected successfully, but no emails were found in the selected folder.",
                "account": email_addr,
                "is_demo": False,
                "emails": [],
                "stats": compute_dashboard_stats([])
            })

        analyzed_emails = []
        for raw in raw_emails:
            processed = ai_engine.full_pipeline_process(raw)
            analyzed_emails.append(processed)

        CURRENT_SESSION["account"] = email_addr
        CURRENT_SESSION["is_demo"] = False
        CURRENT_SESSION["emails"] = analyzed_emails

        stats = compute_dashboard_stats(analyzed_emails)

        return jsonify({
            "success": True,
            "account": email_addr,
            "is_demo": False,
            "emails": analyzed_emails,
            "stats": stats
        })

    except ValueError as ve:
        return jsonify({"success": False, "error": str(ve)}), 401
    except ConnectionError as ce:
        return jsonify({"success": False, "error": str(ce)}), 502
    except Exception as e:
        return jsonify({"success": False, "error": f"Failed to retrieve emails: {str(e)}"}), 500

@app.route('/api/analyze-single', methods=['POST'])
def analyze_single():
    """Analyze an ad-hoc or pasted email on the fly."""
    data = request.json or {}
    email_obj = {
        "id": f"manual-{os.urandom(4).hex()}",
        "sender": data.get("sender", "Unknown Sender <unknown@domain.com>"),
        "recipient": data.get("recipient", "me@domain.com"),
        "subject": data.get("subject", "No Subject"),
        "body": data.get("body", ""),
        "date": data.get("date", "Just now"),
        "unread": False
    }
    processed = ai_engine.full_pipeline_process(email_obj)
    return jsonify({"success": True, "email": processed})

@app.route('/api/summarize', methods=['POST'])
def summarize():
    """Generates on-demand summary and extracted metadata."""
    data = request.json or {}
    subject = data.get("subject", "")
    body = data.get("body", "")
    res = ai_engine.summarize_email(subject, body)
    return jsonify({"success": True, "summary": res})

@app.route('/api/generate-replies', methods=['POST'])
def generate_replies():
    """Generates tone-based smart replies."""
    data = request.json or {}
    sender = data.get("sender", "")
    subject = data.get("subject", "")
    body = data.get("body", "")
    is_spam = data.get("is_spam", False)
    replies = ai_engine.generate_replies(sender, subject, body, is_spam=is_spam)
    return jsonify({"success": True, "replies": replies})

@app.route('/api/translate', methods=['POST'])
def translate():
    """Translates text into target language."""
    data = request.json or {}
    text = data.get("text", "")
    target_lang = data.get("target_lang", "en")
    
    if not text.strip():
        return jsonify({"success": False, "error": "No text provided."}), 400

    translated_text = ai_engine.translate_text(text, target_lang=target_lang)
    lang_name = ai_engine.detect_language(text).get("name", "Unknown")
    
    return jsonify({
        "success": True,
        "translated_text": translated_text,
        "target_lang": target_lang,
        "source_lang_name": lang_name
    })

@app.route('/api/feedback', methods=['POST'])
def feedback():
    """Saves user feedback / corrections to improve classification."""
    data = request.json or {}
    email_id = data.get("email_id", "")
    original_category = data.get("original_category", "")
    user_marked_category = data.get("user_marked_category", "")
    is_spam_corrected = data.get("is_spam_corrected", False)
    notes = data.get("notes", "")

    res = ai_engine.record_feedback(
        email_id=email_id,
        original_category=original_category,
        user_marked_category=user_marked_category,
        is_spam_corrected=is_spam_corrected,
        notes=notes
    )
    return jsonify(res)

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Returns the current session's aggregate dashboard stats."""
    return jsonify({
        "success": True,
        "account": CURRENT_SESSION.get("account", ""),
        "stats": compute_dashboard_stats(CURRENT_SESSION.get("emails", []))
    })

if __name__ == '__main__':
    # Initialize with demo data by default so endpoints are ready immediately
    for raw in DEMO_EMAILS:
        CURRENT_SESSION["emails"].append(ai_engine.full_pipeline_process(raw))
    print("AI Email Security Engine running on http://127.0.0.1:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
