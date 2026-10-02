import React, { useState } from 'react';
import { X, Sparkles, Send, ShieldAlert, ShieldCheck, Minimize2, Maximize2, AlertTriangle, FileText } from 'lucide-react';

export default function ComposeModal({ isOpen, onClose, onAnalyze, onAddToInbox }) {
  const [sender, setSender] = useState('sender@example.com');
  const [recipient, setRecipient] = useState('me@security.ai');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  if (!isOpen) return null;

  const handleScan = async () => {
    if (!body.trim() && !subject.trim()) return;
    setAnalyzing(true);
    try {
      const emailObj = {
        sender,
        subject,
        body,
        date: new Date().toISOString()
      };
      const result = await onAnalyze(emailObj);
      setScanResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSaveToInbox = () => {
    if (!scanResult) return;
    onAddToInbox(scanResult);
    onClose();
    // Reset
    setSubject('');
    setBody('');
    setScanResult(null);
  };

  const insertTemplate = (type) => {
    if (type === 'phishing') {
      setSender('security-team@amaz0n-alerts.xyz');
      setSubject('URGENT: Suspicious order detected on your Amazon account');
      setBody('Dear customer, Your recent order of $899.99 for Apple iPhone 15 Pro is pending authorization. If you did not make this purchase, click here immediately to cancel: http://192.168.1.105/amazon-verify-login.php. Failure to verify within 1 hour will complete the transaction.');
    } else if (type === 'safe') {
      setSender('hr@company.com');
      setSubject('Annual Health Insurance Enrollment & Benefits Review');
      setBody('Hi Team, Open enrollment for next year benefits begins next Monday. Please review the updated plan documents on the internal intranet portal and submit your elections before the end of the month. Reach out if you have any questions.');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '16px',
      right: '24px',
      width: '560px',
      maxWidth: 'calc(100vw - 48px)',
      backgroundColor: '#ffffff',
      borderRadius: '14px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
      border: '1px solid #cbd5e1',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }} className="fade-in">
      {/* Title Bar */}
      <div style={{
        padding: '10px 16px',
        backgroundColor: '#f1f5f9',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '0.875rem', color: '#1f2937' }}>
          <Sparkles size={16} color="#1a73e8" />
          <span>New Message & AI Threat Scanner</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Quick Templates Bar */}
      <div style={{
        padding: '8px 16px',
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.75rem'
      }}>
        <span style={{ color: '#64748b', fontWeight: '600' }}>Insert Sample:</span>
        <button
          type="button"
          onClick={() => insertTemplate('phishing')}
          style={{
            padding: '3px 8px',
            borderRadius: '6px',
            border: '1px solid #fecaca',
            backgroundColor: '#fef2f2',
            color: '#dc2626',
            cursor: 'pointer',
            fontSize: '0.725rem',
            fontWeight: '600'
          }}
        >
          🚨 Phishing Scam
        </button>
        <button
          type="button"
          onClick={() => insertTemplate('safe')}
          style={{
            padding: '3px 8px',
            borderRadius: '6px',
            border: '1px solid #bbf7d0',
            backgroundColor: '#f0fdf4',
            color: '#15803d',
            cursor: 'pointer',
            fontSize: '0.725rem',
            fontWeight: '600'
          }}
        >
          ✅ Clean Ham
        </button>
      </div>

      {/* Compose Form */}
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="From (Sender email)"
            value={sender}
            onChange={(e) => setSender(e.target.value)}
            className="input-field"
            style={{ fontSize: '0.825rem', padding: '8px 10px' }}
          />
          <input
            type="text"
            placeholder="To (Recipient)"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="input-field"
            style={{ fontSize: '0.825rem', padding: '8px 10px' }}
          />
        </div>

        <input
          type="text"
          placeholder="Subject line..."
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="input-field"
          style={{ fontSize: '0.85rem', fontWeight: '600', padding: '8px 10px' }}
        />

        <textarea
          placeholder="Type email body or paste suspicious email content here to scan..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={6}
          className="input-field"
          style={{ fontSize: '0.85rem', resize: 'vertical', minHeight: '110px' }}
        />

        {/* Scan Result Preview */}
        {scanResult && (
          <div style={{
            padding: '12px',
            borderRadius: '10px',
            backgroundColor: scanResult.security?.is_spam ? '#fef2f2' : '#f0fdf4',
            border: scanResult.security?.is_spam ? '1px solid #fecaca' : '1px solid #bbf7d0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {scanResult.security?.is_spam ? (
                <ShieldAlert size={22} color="#dc2626" />
              ) : (
                <ShieldCheck size={22} color="#15803d" />
              )}
              <div>
                <div style={{
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  color: scanResult.security?.is_spam ? '#991b1b' : '#14532d'
                }}>
                  {scanResult.security?.is_spam ? `Threat Flagged: ${scanResult.security?.category}` : 'Verified Clean / Safe Email'}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  Risk Score: <strong>{scanResult.security?.risk_score}%</strong> • Detected Language: {scanResult.language?.name}
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveToInbox}
              className="btn btn-sm btn-primary"
            >
              Add to Inbox
            </button>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div style={{
        padding: '12px 16px',
        backgroundColor: '#f8fafc',
        borderTop: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
          Supports instant phishing, scam & link analysis
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleScan}
            disabled={analyzing || (!body.trim() && !subject.trim())}
            className="btn btn-primary"
            style={{ padding: '8px 18px', fontSize: '0.85rem' }}
          >
            <Sparkles size={16} />
            {analyzing ? 'Scanning Content...' : 'Scan with AI'}
          </button>
        </div>
      </div>
    </div>
  );
}
