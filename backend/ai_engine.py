"""
AI Engine for Intelligent Email Security & Assistant System
Handles:
1. Spam Classification & Multi-Class Categorization (Ad, Phishing, Financial, Job, Lottery, Malicious Link, Other)
2. Security Threat & Risk Analysis (Spoofing, Urgency, Malicious URLs, Credential Harvesting)
3. Smart Summarization & Key Points, Action Items, Dates/Deadlines Extraction
4. Multi-Tone Smart Reply Generation (Professional, Friendly, Formal, Direct/Decline)
5. Language Detection & Multi-Lingual Translation (English, Tamil, Hindi, etc.)
"""

import re
import os
import json
import math
from datetime import datetime
from langdetect import detect, DetectorFactory
from deep_translator import GoogleTranslator

# Enforce deterministic language detection
DetectorFactory.seed = 0

LANGUAGE_NAMES = {
    'en': 'English',
    'ta': 'Tamil (தமிழ்)',
    'hi': 'Hindi (हिन्दी)',
    'te': 'Telugu (తెలుగు)',
    'ml': 'Malayalam (മലയാളം)',
    'kn': 'Kannada (ಕನ್ನಡ)',
    'bn': 'Bengali (বাংলা)',
    'mr': 'Marathi (मराठी)',
    'gu': 'Gujarati (ગુજરાતી)',
    'es': 'Spanish (Español)',
    'fr': 'French (Français)',
    'de': 'German (Deutsch)',
    'zh-cn': 'Chinese (Simplified)',
    'zh-tw': 'Chinese (Traditional)',
    'ja': 'Japanese (日本語)',
    'ru': 'Russian (Русский)',
    'ar': 'Arabic (العربية)',
    'pt': 'Portuguese (Português)',
    'it': 'Italian (Italiano)',
    'ko': 'Korean (한국어)',
}

# Spam category definitions & keyword/regex signatures
CATEGORIES = [
    "Clean / Safe",
    "Advertisement Spam",
    "Phishing Spam",
    "Financial Scam",
    "Job Spam",
    "Lottery/Prize Spam",
    "Malicious Link Spam",
    "Other Spam"
]

CATEGORY_PATTERNS = {
    "Phishing Spam": [
        r"(verify|update|confirm)\s+(your\s+)?(account|identity|password|credential|security|banking|kyc|pan\s+card|aadhaar)",
        r"(unauthorized|suspicious)\s+(activity|login|access|attempt)",
        r"(account|access|service)\s+(has\s+been\s+)?(suspended|locked|restricted|blocked|disabled)",
        r"(within\s+24\s+hours|immediate\s+action|urgent\s+action|permanent\s+termination)",
        r"(login|security-login|portal|update-portal|verify-paypal|verify-bank).*\.(ru|top|cc|xyz|in|tk|ga|cf|gq|club|online)",
        r"खाता.*ब्लॉक.*kyc|आधार.*पैन.*सत्यापन|पासवर्ड.*दर्ज"
    ],
    "Financial Scam": [
        r"(wire\s+transfer|western\s+union|cryptocurrency|bitcoin|usdt|overdue\s+invoice|unpaid\s+bill)",
        r"(administrative\s+fee|processing\s+fee|security\s+deposit|refundable\s+token|advance\s+fee)",
        r"(\$\d+[\d,]*(\.\d+)?|\b\d+\s*lakh|\b\d+\s*crore|\b\d+\s*usd)\s+(payout|claim|reward|inheritance|consignment)",
        r"(fiduciary|barrister|diplomat|beneficiary|inheritance|fund\s+release|compensation\s+fund)"
    ],
    "Lottery/Prize Spam": [
        r"(congratulations|you\s+have\s+won|selected\s+winner|lucky\s+draw|sweepstakes|jackpot|cash\s+bonanza)",
        r"(winning\s+ticket|batch\s+ref|claim\s+your\s+prize|million\s+dollars|lump\s+sum\s+payout)",
        r"payout.*winner|congratulation.*won"
    ],
    "Job Spam": [
        r"(work[\s-]from[\s-]home|data\s+entry|crypto\s+processing|part[\s-]time\s+job\s+offer)",
        r"(earn\s+\$\d+.*(day|month|daily|weekly)|earn\s+₹\d+.*daily|no\s+experience\s+needed)",
        r"(refundable\s+deposit|starter\s+kit\s+fee|registration\s+fee\s+for\s+job)"
    ],
    "Malicious Link Spam": [
        r"https?://[^\s]+\.(exe|zip|scr|vbs|bat|pdf\.exe|docm|xlsm)",
        r"https?://[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}",
        r"(download.*invoice.*\.exe|download.*statement.*\.exe)"
    ],
    "Advertisement Spam": [
        r"(\d+%\s+off|flash\s+sale|clearance\s+sale|exclusive\s+discount|coupon\s+code|limited\s+stock|buy\s+now|order\s+now)",
        r"(free\s+express\s+shipping|lowest\s+price\s+guaranteed|shop\s+now|daily\s+deals)",
        r"(unsubscribe.*marketing|optout|view\s+in\s+browser)"
    ]
}

# Suspicious TLDs often used in disposable spam campaigns
SUSPICIOUS_TLDS = ['.ru', '.top', '.xyz', '.cc', '.tk', '.ga', '.cf', '.gq', '.online', '.site', '.work', '.click', '.link', '.buzz']

class AIEmailEngine:
    def __init__(self, feedback_path="backend/data/feedback.json"):
        self.feedback_path = feedback_path
        self._ensure_feedback_store()

    def _ensure_feedback_store(self):
        os.makedirs(os.path.dirname(self.feedback_path), exist_ok=True)
        if not os.path.exists(self.feedback_path):
            with open(self.feedback_path, 'w', encoding='utf-8') as f:
                json.dump({"corrections": [], "ratings": []}, f, indent=2)

    def detect_language(self, text):
        """Detect language of email text with language name."""
        clean_text = re.sub(r'https?://\S+', '', text).strip()
        if not clean_text or len(clean_text) < 3:
            return {'code': 'en', 'name': 'English', 'confidence': 0.99}
        
        # Check Tamil unicode range
        if re.search(r'[\u0B80-\u0BFF]', clean_text):
            return {'code': 'ta', 'name': 'Tamil (தமிழ்)', 'confidence': 0.98}
            
        # Check Hindi / Devanagari unicode range
        if re.search(r'[\u0900-\u097F]', clean_text):
            return {'code': 'hi', 'name': 'Hindi (हिन्दी)', 'confidence': 0.98}

        # Check Telugu
        if re.search(r'[\u0C00-\u0C7F]', clean_text):
            return {'code': 'te', 'name': 'Telugu (తెలుగు)', 'confidence': 0.98}

        try:
            detected_code = detect(clean_text)
            name = LANGUAGE_NAMES.get(detected_code, detected_code.upper())
            return {'code': detected_code, 'name': name, 'confidence': 0.95}
        except Exception:
            return {'code': 'en', 'name': 'English', 'confidence': 0.90}

    def translate_text(self, text, target_lang='en'):
        """Translates text to target language code with multi-provider chunking."""
        if not text or not text.strip():
            return ""

        import requests
        
        # Detect source language
        detected = self.detect_language(text)
        source_code = detected.get('code', 'en')
        if source_code == target_lang:
            return text

        lines = [l for l in text.split('\n')]
        translated_lines = []

        for line in lines:
            if not line.strip():
                translated_lines.append("")
                continue

            # Split line into chunks under 400 chars for API limits
            chunks = []
            if len(line) <= 400:
                chunks = [line]
            else:
                sentences = re.split(r'(\. |\? |\! )', line)
                current = ""
                for s in sentences:
                    if len(current) + len(s) < 380:
                        current += s
                    else:
                        if current:
                            chunks.append(current)
                        current = s
                if current:
                    chunks.append(current)

            chunk_results = []
            for chunk in chunks:
                if not chunk.strip():
                    continue
                translated_chunk = None

                # Method 1: MyMemory API with source | target pair
                try:
                    langpair = f"{source_code}|{target_lang}"
                    r = requests.get(
                        'https://api.mymemory.translated.net/get',
                        params={'q': chunk.strip(), 'langpair': langpair},
                        timeout=6
                    )
                    if r.status_code == 200:
                        data = r.json()
                        resp_text = data.get('responseData', {}).get('translatedText')
                        if resp_text and 'LIMIT EXCEDEED' not in resp_text.upper():
                            translated_chunk = resp_text
                except Exception:
                    pass

                # Method 2: Google Translator direct web endpoint
                if not translated_chunk:
                    try:
                        g_url = 'https://translate.googleapis.com/translate_a/single'
                        params = {
                            'client': 'gtx',
                            'sl': 'auto',
                            'tl': target_lang,
                            'dt': 't',
                            'q': chunk.strip()
                        }
                        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
                        r = requests.get(g_url, params=params, headers=headers, timeout=6)
                        if r.status_code == 200:
                            data = r.json()
                            translated_chunk = ''.join([part[0] for part in data[0] if part[0]])
                    except Exception:
                        pass

                # Fallback to original chunk if all providers failed
                chunk_results.append(translated_chunk or chunk)

            translated_lines.append(" ".join(chunk_results))

        return "\n".join(translated_lines)

    def extract_urls(self, text):
        """Finds all URLs in email text."""
        url_pattern = r'https?://(?:[-\w.]|(?:%[\da-fA-F]{2}))+[^\s]*'
        return list(set(re.findall(url_pattern, text)))

    def analyze_security(self, sender, subject, body):
        """
        Deep threat analysis for spam classification, categorisation, risk scoring and security checks.
        """
        combined = f"{subject}\n{body}".lower()
        sender_lower = sender.lower()
        
        risk_score = 0
        threats_found = []
        category_scores = {
            "Phishing Spam": 0,
            "Financial Scam": 0,
            "Job Spam": 0,
            "Lottery/Prize Spam": 0,
            "Malicious Link Spam": 0,
            "Advertisement Spam": 0,
            "Other Spam": 0
        }

        # 1. URL Inspection
        urls = self.extract_urls(body)
        suspicious_urls = []
        for url in urls:
            for tld in SUSPICIOUS_TLDS:
                if tld in url.lower():
                    suspicious_urls.append(url)
                    category_scores["Malicious Link Spam"] += 35
                    threats_found.append(f"Suspicious top-level domain detected ({tld}) in link: {url[:45]}...")
                    risk_score += 30
                    break
            if re.search(r'\.(exe|scr|vbs|bat|pdf\.exe|docm)$', url.lower()):
                category_scores["Malicious Link Spam"] += 50
                threats_found.append(f"Executable/Dangerous payload URL: {url[:45]}...")
                risk_score += 45
            if re.search(r'https?://\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', url):
                threats_found.append(f"Direct IP address URL detected: {url[:40]}...")
                risk_score += 25

        # 2. Sender Domain & Spoofing Check
        if ("paypal" in sender_lower or "bank" in sender_lower or "security" in sender_lower or "google" in sender_lower or "icici" in sender_lower) and \
           not any(domain in sender_lower for domain in ["paypal.com", "google.com", "icicibank.com", "microsoft.com", "github.com"]):
            threats_found.append("Sender brand impersonation / spoofed display name detected")
            category_scores["Phishing Spam"] += 40
            risk_score += 40

        # 3. Category Regex Pattern Matching
        for category, patterns in CATEGORY_PATTERNS.items():
            for pattern in patterns:
                matches = re.findall(pattern, combined, re.IGNORECASE)
                if matches:
                    weight = 25 * len(matches)
                    category_scores[category] += weight
                    if category in ["Phishing Spam", "Financial Scam", "Lottery/Prize Spam", "Malicious Link Spam"]:
                        risk_score += weight
                    elif category in ["Job Spam", "Advertisement Spam"]:
                        risk_score += int(weight * 0.7)

        # 4. Psychological Triggers (Urgency & Threat of Loss)
        urgency_match = re.findall(r'(urgent|immediately|within 24 hours|action required|suspended|block|penalty|legal action)', combined)
        if len(urgency_match) >= 2:
            threats_found.append(f"High artificial urgency & coercion tactics ({len(urgency_match)} indicators)")
            risk_score += 20

        # 5. Sensitive Credential / Financial Requests
        if re.search(r'(credit card|cvv|password|pin|ssn|aadhaar|pan card|otp|bank transfer)', combined) and \
           re.search(r'(verify|submit|enter|update|confirm|deposit|fee)', combined):
            threats_found.append("Sensitive credential or payment information solicitation")
            category_scores["Phishing Spam"] += 30
            risk_score += 35

        # 6. Legitimate / Ham indicators
        legit_bonus = 0
        if re.search(r'(agenda|meeting|sprint planning|pull request|jira|github|docker|review doc|architecture|colleague)', combined):
            legit_bonus += 40
        if re.search(r'(best regards|warm regards|lead solutions architect|team meeting|confluence)', combined):
            legit_bonus += 20
        if sender.endswith("@google.com>") or sender.endswith("@github.com>") or sender.endswith(".edu>"):
            if not suspicious_urls and not re.search(r'(won \$\d+|lottery)', combined):
                legit_bonus += 30

        # Normalize score
        final_risk = min(100, max(0, risk_score - legit_bonus))
        is_spam = final_risk >= 38

        # Determine dominant category
        if not is_spam:
            final_category = "Clean / Safe"
            risk_level = "Safe (Low Risk)"
        else:
            sorted_cats = sorted(category_scores.items(), key=lambda x: x[1], reverse=True)
            if sorted_cats[0][1] > 0:
                final_category = sorted_cats[0][0]
            else:
                final_category = "Other Spam"

            if final_risk >= 75:
                risk_level = "Critical Threat (High Risk)"
            elif final_risk >= 50:
                risk_level = "High Risk Spam"
            else:
                risk_level = "Moderate Spam / Suspicious"

        # Security recommendations
        recommendations = []
        if is_spam:
            if "Phishing" in final_category or "Credential" in str(threats_found):
                recommendations.append("Do NOT enter any passwords, OTPs, or financial info.")
            if suspicious_urls:
                recommendations.append("Do NOT click links from this unrecognized sender.")
            recommendations.append("Mark as spam and block sender domain immediately.")
        else:
            recommendations.append("This email passed automated security integrity checks.")

        return {
            "is_spam": is_spam,
            "category": final_category,
            "risk_score": final_risk,
            "risk_level": risk_level,
            "threats_found": threats_found,
            "extracted_urls": urls,
            "suspicious_urls": suspicious_urls,
            "recommendations": recommendations,
            "category_scores": category_scores
        }

    def summarize_email(self, subject, body):
        """
        Converts email to concise summary, extracts key points, dates/deadlines, and action items.
        """
        lines = [l.strip() for l in body.split('\n') if l.strip()]
        
        # Clean boilerplate
        filtered_lines = [
            l for l in lines 
            if not re.match(r'^(dear|hi|hello|regards|best regards|thanks|warm regards|ref:|to unsubscribe)', l, re.IGNORECASE)
        ]

        # Generate TL;DR
        tldr = ""
        if len(filtered_lines) > 0:
            first_sentence = filtered_lines[0]
            if len(first_sentence) < 40 and len(filtered_lines) > 1:
                first_sentence += " " + filtered_lines[1]
            tldr = f"Subject focuses on: {subject}. Core message: {first_sentence[:220]}..."
        else:
            tldr = f"Email regarding: {subject}."

        # Extract Key Points
        key_points = []
        for line in lines:
            if re.search(r'(agenda|key|point|offer|winner|invoice|note|warning|payout|compensation|position|benefit)', line, re.IGNORECASE) or \
               re.match(r'^[\d\*\-\•]\s*', line):
                clean_pt = re.sub(r'^[\d\*\-\•\.\)]\s*', '', line).strip()
                if len(clean_pt) > 10 and clean_pt not in key_points:
                    key_points.append(clean_pt)
            if len(key_points) >= 4:
                break
        
        if not key_points and filtered_lines:
            key_points = [l[:120] for l in filtered_lines[:3]]

        # Extract Dates & Deadlines
        date_patterns = [
            r'(\b(?:january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4}\b)',
            r'(\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+\d{1,2}(?:st|nd|rd|th)?\b)',
            r'(\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b)',
            r'(\b(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)(?:\s+at\s+\d{1,2}(?::\d{2})?\s*(?:am|pm|est|ist|pst)?)?\b)',
            r'(\bwithin\s+\d+\s+(?:hours|days)\b)',
            r'(\btoday\b|\btomorrow\b|\bend\s+of\s+day\b|\b24\s+hours\b)'
        ]
        extracted_dates = []
        for pat in date_patterns:
            matches = re.findall(pat, body, re.IGNORECASE)
            for m in matches:
                if isinstance(m, tuple):
                    m = m[0]
                m_clean = m.strip()
                if m_clean.lower() not in [d.lower() for d in extracted_dates] and len(m_clean) > 2:
                    extracted_dates.append(m_clean)

        # Extract Action Items
        action_items = []
        for line in lines:
            if re.search(r'(please|action required|must|upload|submit|review|verify|click|pay|reply|settle|register|send|attend)', line, re.IGNORECASE):
                cleaned_action = re.sub(r'^[\d\*\-\•\.\)]\s*', '', line).strip()
                if 10 < len(cleaned_action) < 160 and cleaned_action not in action_items:
                    action_items.append(cleaned_action)
            if len(action_items) >= 4:
                break

        return {
            "tldr": tldr,
            "key_points": key_points[:5],
            "dates_deadlines": extracted_dates[:5],
            "action_items": action_items[:5]
        }

    def generate_replies(self, sender, subject, body, is_spam=False):
        """
        Generates contextual smart reply suggestions for multiple tones.
        """
        sender_name = sender.split('<')[0].replace('"', '').strip()
        if not sender_name:
            sender_name = "there"

        if is_spam:
            return {
                "professional": f"Hello,\n\nPlease remove my email address from your mailing list and cease any further communications. I did not request this communication.\n\nThank you.",
                "friendly": f"Hi {sender_name},\n\nI am not interested in this offer/message. Please unsubscribe me from future emails.\n\nBest regards.",
                "formal": f"To Whom It May Concern,\n\nBe advised that this address does not accept unsolicited solicitations. Please remove this email from all your marketing records immediately in accordance with privacy compliance regulations.\n\nRegards.",
                "direct_decline": f"Unsubscribe. Please do not contact me again."
            }

        # Ham email replies tailored to meetings / business / general inquiries
        is_meeting = bool(re.search(r'(meeting|review|schedule|sprint|interview|call)', f"{subject} {body}", re.IGNORECASE))
        is_interview = bool(re.search(r'(interview|job|resume|role|candidate|பணி|நேர்காணல்)', f"{subject} {body}", re.IGNORECASE))

        if is_interview:
            return {
                "professional": f"Dear {sender_name},\n\nThank you for reaching out regarding this opportunity. I would be pleased to participate in the interview as proposed. I have attached my updated resume for your review.\n\nLooking forward to speaking with the team.\n\nBest regards,",
                "friendly": f"Hi {sender_name},\n\nThanks so much for getting in touch! I'm very excited about this role. The proposed time works great for me. Please let me know if you need any additional portfolio samples ahead of the call.\n\nCheers,",
                "formal": f"Dear {sender_name},\n\nI acknowledge receipt of your invitation for the interview. I confirm my availability for the designated schedule and look forward to discussing how my qualifications align with your organizational goals.\n\nSincerely,",
                "direct_decline": f"Dear {sender_name},\n\nThank you for considering my profile. However, I am currently not seeking new opportunities at this time. I wish you the best in filling the position.\n\nRegards,"
            }

        if is_meeting:
            return {
                "professional": f"Hi {sender_name},\n\nThanks for organizing the meeting. The proposed agenda looks solid. I will review the shared materials and have my updates prepared in advance.\n\nBest regards,",
                "friendly": f"Hey {sender_name},\n\nSounds like a great plan! The time works well for me. I'll take a look at the design docs beforehand and share my feedback.\n\nSee you then!",
                "formal": f"Dear {sender_name},\n\nThank you for the update. I have marked my calendar accordingly. I will ensure all required benchmark reports and deliverables are submitted prior to the session.\n\nSincerely,",
                "direct_decline": f"Hi {sender_name},\n\nThank you for the invitation. Unfortunately, I have a direct scheduling conflict at that time. Could we explore an alternate slot or can I share my written updates asynchronously?\n\nBest,"
            }

        # Default general business replies
        return {
            "professional": f"Hi {sender_name},\n\nThank you for the detailed information. I have reviewed the contents and will follow up with the required next steps shortly.\n\nBest regards,",
            "friendly": f"Hi {sender_name},\n\nThanks for sharing this with me! Everything looks clear. I'll get back to you with any questions once I take a deeper look.\n\nHave a great day!",
            "formal": f"Dear {sender_name},\n\nI acknowledge receipt of your correspondence regarding \"{subject}\". I will review the matter with relevant stakeholders and provide a formal response in due course.\n\nSincerely,",
            "direct_decline": f"Hi {sender_name},\n\nThank you for reaching out. We will not be proceeding with this at the current time, but we appreciate you keeping us in mind.\n\nRegards,"
        }

    def record_feedback(self, email_id, original_category, user_marked_category, is_spam_corrected, notes=""):
        """Stores user feedback for continual improvement."""
        try:
            with open(self.feedback_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            entry = {
                "email_id": email_id,
                "timestamp": datetime.utcnow().isoformat() + "Z",
                "original_category": original_category,
                "user_marked_category": user_marked_category,
                "is_spam_corrected": is_spam_corrected,
                "notes": notes
            }
            data["corrections"].append(entry)
            with open(self.feedback_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2)
            return {"status": "success", "total_feedback_count": len(data["corrections"])}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    def full_pipeline_process(self, email_obj):
        """Processes an email through the complete AI intelligence & security pipeline."""
        sender = email_obj.get("sender", "")
        subject = email_obj.get("subject", "")
        body = email_obj.get("body", "")

        # 1. Security Analysis & Spam Categorization
        security = self.analyze_security(sender, subject, body)

        # 2. Language Detection
        lang_info = self.detect_language(f"{subject} {body}")

        # 3. Summarization & Action Item Extraction
        summary = self.summarize_email(subject, body)

        # 4. Smart Reply Generation
        replies = self.generate_replies(sender, subject, body, is_spam=security["is_spam"])

        return {
            **email_obj,
            "security": security,
            "language": lang_info,
            "summary": summary,
            "smart_replies": replies,
            "analyzed_at": datetime.utcnow().isoformat() + "Z"
        }
