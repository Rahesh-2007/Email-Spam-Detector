import React, { useState } from 'react';
import { Sparkles, Shield, Send, FileText, Globe, MessageSquare, AlertTriangle } from 'lucide-react';
import EmailInspector from './EmailInspector';

const SAMPLE_TEMPLATES = [
  {
    title: '🚨 PayPal Phishing Scam',
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
    subject: 'நேர்காணல் அழைப்பு: முன்னணி AI நிறுவனத்தில் Senior AI Engineer வேலை வாய்ப்பு',
    body: `அன்புள்ள விண்ணப்பதாரரே,

உங்கள் லிங்க்ட்இன் (LinkedIn) சுயவிவரத்தைப் பார்த்தோம். உங்கள் முந்தைய AI திட்டங்கள் மற்றும் Machine Learning திறன்கள் மிகவும் ஈர்க்கக்கூடியதாக உள்ளன.

எங்கள் வாடிக்கையாளர் முன்னணி சர்வதேச AI நிறுவனத்தில் 'Senior AI Engineer' பணிக்காக உங்கள் விண்ணப்பம் பரிசீலிக்கப்பட்டுள்ளது.

நேர்காணல் விவரங்கள்:
தேதி: அக்டோபர் 10, 2026 (வியாழக்கிழமை)
நேரம்: காலை 11:00 AM IST
இடம்: Google Meet வழியாக நடைபெறும்

சம்பள தொகுப்பு: ஆண்டுக்கு ₹24,00,000 - ₹32,00,000 + போனஸ்.

இந்த நேர்காணலை உறுதி செய்ய உங்கள் ஒப்புதலையும், தற்போதைய சுயவிவரக் குறிப்பையும் (Updated Resume) இந்த மின்னஞ்சலுக்குப் பதில் அனுப்பி உறுதிப்படுத்தவும்.

நன்றி,
சுந்தரராஜன்
தலைமை ஆட்சேர்ப்பு ஆலோசகர்`
  },
  {
    title: '🏦 Hindi Bank KYC Scam (हिन्दी)',
    sender: 'HDFC Banking Alerts <alert@hdfc-kyc-verify-portal.in>',
    subject: 'अति आवश्यक: आपका बैंक खाता 24 घंटे में ब्लॉक हो जाएगा - तुरंत KYC पूरा करें',
    body: `प्रिय ग्राहक,

आरबीआई (RBI) के नए दिशा-निर्देशों के अनुसार आपके बैंक खाते का तत्काल बायोमेट्रिक ई-केवाईसी (E-KYC) सत्यापन आवश्यक है।

यदि आप आज शाम 5 बजे से पहले अपना पैन कार्ड और आधार कार्ड सत्यापित नहीं करते हैं, तो आपकी नेट बैंकिंग और यूपीआई (UPI) सेवाएं 24 घंटे में स्थायी रूप से बंद कर दी जाएंगी।

तुरंत अपना ई-केवाईसी पूरा करने के लिए नीचे दिए गए बैंक लिंक पर क्लिक करें:
http://update-kyc-netbanking.bank-verify.xyz/login

लिंक पर जाकर अपना 16-अंकों का एटीएम कार्ड नंबर, पिन (PIN) और नेट बैंकिंग पासवर्ड दर्ज करके फॉर्म सबमिट करें।

सुरक्षा विभाग,
एचडीएफसी बैंक इंडिया`
  },
  {
    title: '✅ Clean Corporate Agenda (Safe)',
    sender: 'Sarah Jenkins <sarah.jenkins@acmecorp.com>',
    subject: 'Sprint 24 Planning Meeting & Quarterly Product Roadmap - Thursday 2:00 PM',
    body: `Hi Team,

Hope you are having a productive week.

Please find below the agenda for our upcoming Sprint 24 Planning and Q4 Roadmap review scheduled for this Thursday at 2:00 PM EST via Zoom.

Meeting Agenda:
1. Review completed deliverables from Sprint 23 (15 mins)
2. Sprint 24 backlog grooming and story point allocation (25 mins)
3. Infrastructure budget update and AWS cloud cost optimizations (10 mins)
4. Open Q&A and blocker resolution (10 mins)

Action Items:
- Please update your Jira tickets before Wednesday 5:00 PM.
- Product managers to finalize Sprint 24 acceptance criteria.

Looking forward to a great planning session.

Best regards,
Sarah Jenkins
Director of Engineering, Acme Corp`
  }
];

export default function ManualAnalyzerView({ onAnalyzeSingle, onTranslate, onFeedback }) {
  const [sender, setSender] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzedEmail, setAnalyzedEmail] = useState(null);

  const handleLoadTemplate = (tpl) => {
    setSender(tpl.sender);
    setSubject(tpl.subject);
    setBody(tpl.body);
    setAnalyzedEmail(null);
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!body.trim() && !subject.trim()) return;

    setAnalyzing(true);
    try {
      const emailObj = {
        sender: sender.trim() || 'anonymous@unknown.com',
        subject: subject.trim(),
        body: body.trim(),
        date: new Date().toISOString()
      };
      const result = await onAnalyzeSingle(emailObj);
      setAnalyzedEmail(result);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleQuickStatusToggle = (emailId, isSpam) => {
    if (analyzedEmail) {
      setAnalyzedEmail(prev => ({
        ...prev,
        security: {
          ...prev.security,
          is_spam: isSpam,
          category: isSpam ? (prev.security.category === 'Clean / Safe' ? 'Other Spam' : prev.security.category) : 'Clean / Safe'
        }
      }));
    }
  };

  return (
    <div className="fade-in" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Intro Header */}
      <div style={{
        padding: '20px 24px',
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1a73e8', fontWeight: '700', fontSize: '0.85rem', marginBottom: '4px' }}>
          <Sparkles size={16} /> Manual Threat Analyzer & Testing Sandbox
        </div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#1f2937', marginBottom: '6px' }}>
          Inspect Any Custom or Suspicious Email
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#4b5563', margin: 0 }}>
          Paste raw email headers, body text, or choose from realistic sample attacks (phishing links, multi-lingual job offers, fake banking KYC).
        </p>
      </div>

      {/* Preset Buttons */}
      <div style={{
        padding: '14px 18px',
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        flexWrap: 'wrap'
      }}>
        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#374151' }}>
          Preload Sample Threat:
        </span>
        {SAMPLE_TEMPLATES.map((tpl, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleLoadTemplate(tpl)}
            className="btn btn-sm btn-secondary"
            style={{ fontSize: '0.775rem' }}
          >
            {tpl.title}
          </button>
        ))}
      </div>

      {/* Two Column Layout: Input Form vs Live Analysis */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: analyzedEmail ? '1fr 1fr' : '1fr',
        gap: '20px',
        alignItems: 'start'
      }}>
        
        {/* Left Column: Form */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <form onSubmit={handleAnalyze} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                Sender (Email or Name)
              </label>
              <input
                type="text"
                placeholder="e.g. PayPal Alert <service@paypa1.com>"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                Email Subject
              </label>
              <input
                type="text"
                placeholder="e.g. URGENT: Action required on your account"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                Email Content / Body
              </label>
              <textarea
                placeholder="Paste email body text, suspicious URLs, or full message here..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={10}
                className="input-field"
                style={{ resize: 'vertical' }}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => {
                  setSender('');
                  setSubject('');
                  setBody('');
                  setAnalyzedEmail(null);
                }}
                className="btn btn-secondary btn-sm"
              >
                Clear Form
              </button>

              <button
                type="submit"
                disabled={analyzing}
                className="btn btn-primary"
                style={{ padding: '10px 20px' }}
              >
                <Sparkles size={16} />
                {analyzing ? 'Scanning Content...' : 'Run Deep Security Scan'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Result in EmailInspector */}
        {analyzedEmail && (
          <div className="fade-in">
            <EmailInspector
              email={analyzedEmail}
              onTranslate={onTranslate}
              onFeedback={onFeedback}
              onQuickStatusToggle={handleQuickStatusToggle}
            />
          </div>
        )}

      </div>

    </div>
  );
}
