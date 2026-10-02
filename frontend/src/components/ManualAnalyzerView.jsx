import React, { useState } from 'react';
import { Sparkles, Shield, Send, FileText, Globe, MessageSquare, AlertTriangle } from 'lucide-react';
import EmailInspector from './EmailInspector';

const SAMPLE_TEMPLATES = [
  {
    title: '🎣 Paypal Phishing Scam',
    sender: 'PayPal Security Alert <verify-account@paypa1-security-center.ru>',
    subject: 'URGENT: Unauthorized Transaction Detected - Confirm Password Within 24h',
    body: `Dear Customer,

We detected an unauthorized transaction of $1,450.00 from your PayPal balance to Binance Exchange on October 2, 2026.

If you did not authorize this payment, you must verify your identity immediately by visiting our secure portal:
http://verify-identity-login.paypal-secure.ru/login?token=88129

Please provide your credit card number, CVV, and current password on the verification portal to unlock your funds.

Failure to verify within 24 hours will result in permanent account suspension.

Sincerely,
Fraud Prevention Department`
  },
  {
    title: '💼 Tamil Job Offer (தமிழ்)',
    sender: 'Sundararajan <sundar@chennai-techhire.in>',
    subject: 'வேலை வாய்ப்பு: சீனியர் AI இன்ஜினியர் பதவிக்கான நேர்காணல் அழைப்பு',
    body: `வணக்கம்,

உங்கள் லிங்க்ட்இன் (LinkedIn) சுயவிவரத்தை நாங்கள் பார்த்தோம். நீங்கள் செய்துள்ள AI மற்றும் Machine Learning திட்டங்கள் மிகவும் சிறப்பாக உள்ளன.

சென்னையில் உள்ள எங்களது முன்னணி மென்பொருள் நிறுவனத்தில் 'Senior AI Engineer' பணிக்கான காலியிடம் உள்ளது. 

நேர்காணல் விவரங்கள்:
தேதி: அக்டோபர் 10, 2026 (சனிக்கிழமை)
நேரம்: காலை 11:00 AM IST
முறை: Google Meet வீடியோ அழைப்பு

சம்பள தொகுப்பு: ஆண்டுக்கு ₹24,00,000 - ₹32,00,000 + போனஸ்.

இந்த நேர்காணலில் கலந்து கொள்ள உங்கள் ஒப்புதலையும், தற்போதைய சுயவிவரக் குறிப்பையும் (Updated Resume) பதில் மின்னஞ்சல் மூலம் அனுப்பவும்.

நன்றி,
சுந்தரராஜன்
தலைமை ஆட்சேர்ப்பு அதிகாரி`
  },
  {
    title: '💰 Hindi Bank KYC Scam (हिन्दी)',
    sender: 'HDFC Banking Alerts <alert@hdfc-kyc-verify-portal.in>',
    subject: 'प्रिय ग्राहक, आपका बैंक खाता 24 घंटे में ब्लॉक हो जाएगा - तुरंत KYC अपडेट करें',
    body: `प्रिय बैंक ग्राहक,

भारतीय रिज़र्व बैंक (RBI) के नए दिशानिर्देशों के अनुसार, आपका बैंक खाता KYC पूरा न होने के कारण 24 घंटे के भीतर निलंबित कर दिया जाएगा।

अपने खाते को सक्रिय रखने के लिए तुरंत नीचे दिए गए लिंक पर क्लिक करें और अपना पैन कार्ड, आधार कार्ड और नेट बैंकिंग पासवर्ड दर्ज करके सत्यापन पूरा करें:

http://hdfc-kyc-update-portal-fake.in/update

यदि आप ऐसा नहीं करते हैं, तो आपका एटीएम कार्ड और ऑनलाइन लेनदेन तुरंत रोक दिया जाएगा।

धन्यवाद,
सुरक्षा विभाग, एचडीएफसी बैंक`
  },
  {
    title: '📅 Engineering Architecture Meeting',
    sender: 'Alex Rivera <arivera@acmetech.io>',
    subject: 'Project Apollo: Q4 Architecture Review & Roadmap Alignment',
    body: `Hi Team,

I'd like to schedule our Q4 Architecture Review for Project Apollo on Wednesday, October 7, 2026 at 3:00 PM EST.

Agenda:
1. GraphQL migration benchmark latency review
2. High-availability multi-region Redis cluster design
3. Security posture & SOC2 compliance checklist

Action Items:
- Please review the architecture doc (v1.8) on Confluence before Tuesday EOD.
- Submit benchmark metrics pull request by Monday afternoon.

Let me know if anyone has scheduling conflicts.

Best,
Alex Rivera
Principal Architect`
  }
];

export default function ManualAnalyzerView({ onAnalyzeSingle, onTranslate, onFeedback }) {
  const [sender, setSender] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzedEmail, setAnalyzedEmail] = useState(null);

  const handleLoadSample = (sample) => {
    setSender(sample.sender);
    setSubject(sample.subject);
    setBody(sample.body);
    setAnalyzedEmail(null);
  };

  const handleRunAnalysis = async (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    setAnalyzing(true);
    try {
      const res = await onAnalyzeSingle({
        sender: sender || 'Unknown <sender@domain.com>',
        subject: subject || 'No Subject',
        body: body
      });
      setAnalyzedEmail(res);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="fade-in" style={{ padding: '0 20px 40px 20px' }}>
      
      {/* Header Info */}
      <div className="glass-panel" style={{ padding: '20px 24px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <Sparkles size={20} color="var(--primary)" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>
            Ad-Hoc Manual Email Security Scanner & Assistant
          </h2>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Paste any raw email message, phishing lure, or multilingual correspondence to inspect threat signatures, extract summaries, and generate instant replies.
        </p>

        {/* Quick Sample Presets */}
        <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Quick Samples:
          </span>
          {SAMPLE_TEMPLATES.map((tpl, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleLoadSample(tpl)}
              className="btn btn-sm btn-secondary"
              style={{ fontSize: '0.75rem', padding: '5px 10px' }}
            >
              {tpl.title}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Input Form (Left) & Inspector (Right) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: analyzedEmail ? '1fr 1.2fr' : '1fr',
        gap: '24px',
        alignItems: 'start'
      }}>
        
        {/* Form Container */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <form onSubmit={handleRunAnalysis}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Sender Email (From)
              </label>
              <input
                type="text"
                placeholder="e.g. Security Center <alert@paypal-login-update.ru>"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                className="input-field"
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Email Subject
              </label>
              <input
                type="text"
                placeholder="e.g. URGENT: Your account has been suspended"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="input-field"
              />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Email Body Text (or Raw Content)
              </label>
              <textarea
                placeholder="Paste the full email text here..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={10}
                className="input-field"
                style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', lineHeight: '1.5' }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={analyzing || !body.trim()}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
            >
              <Shield size={18} />
              {analyzing ? 'Scanning with AI Intelligence...' : 'Scan & Analyze Email'}
            </button>
          </form>
        </div>

        {/* Right Pane: Analysis Results */}
        {analyzedEmail && (
          <div>
            <EmailInspector
              email={analyzedEmail}
              onTranslate={onTranslate}
              onFeedback={onFeedback}
              onQuickStatusToggle={(id, isSpam) => {
                setAnalyzedEmail(prev => ({
                  ...prev,
                  security: { ...prev.security, is_spam: isSpam }
                }));
              }}
            />
          </div>
        )}

      </div>

    </div>
  );
}
