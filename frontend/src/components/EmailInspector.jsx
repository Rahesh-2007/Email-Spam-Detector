import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  Globe, 
  MessageSquare, 
  CheckSquare, 
  Calendar, 
  Copy, 
  Check, 
  Send, 
  AlertTriangle, 
  Star, 
  Inbox,
  User,
  Clock,
  Languages,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

const ALL_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'ta', name: 'Tamil (தமிழ்)' },
  { code: 'hi', name: 'Hindi (हिन्दी)' },
  { code: 'te', name: 'Telugu (తెలుగు)' },
  { code: 'ml', name: 'Malayalam (മലയാളം)' },
  { code: 'kn', name: 'Kannada (ಕನ್ನಡ)' },
  { code: 'bn', name: 'Bengali (বাংলা)' },
  { code: 'es', name: 'Spanish (Español)' },
  { code: 'fr', name: 'French (Français)' },
  { code: 'de', name: 'German (Deutsch)' },
  { code: 'zh-cn', name: 'Chinese (Simplified)' },
  { code: 'ja', name: 'Japanese (日本語)' },
  { code: 'ar', name: 'Arabic (العربية)' },
  { code: 'ru', name: 'Russian (Русский)' }
];

const ALL_CATEGORIES = [
  "Clean / Safe",
  "Advertisement Spam",
  "Phishing Spam",
  "Financial Scam",
  "Job Spam",
  "Lottery/Prize Spam",
  "Malicious Link Spam",
  "Other Spam"
];

export default function EmailInspector({ email, onTranslate, onFeedback, onQuickStatusToggle }) {
  const [activeTab, setActiveTab] = useState('reader'); // 'reader' | 'security' | 'summary' | 'replies' | 'feedback'
  const [selectedTone, setSelectedTone] = useState('professional');
  const [copied, setCopied] = useState(false);
  const [replyText, setReplyText] = useState('');
  
  // Built-in Translation state
  const [targetLang, setTargetLang] = useState('en');
  const [translating, setTranslating] = useState(false);
  const [translatedResult, setTranslatedResult] = useState(null);
  const [isShowingTranslation, setIsShowingTranslation] = useState(false);

  // Feedback state
  const [feedbackCategory, setFeedbackCategory] = useState(email?.security?.category || 'Clean / Safe');
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [starRating, setStarRating] = useState(5);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Action items local checked state
  const [checkedActions, setCheckedActions] = useState({});

  if (!email) {
    return (
      <div className="glass-panel" style={{
        height: '100%',
        minHeight: '480px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        textAlign: 'center'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'var(--bg-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px'
        }}>
          <Inbox size={32} color="var(--text-muted)" />
        </div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '6px' }}>
          Select an Email to Open
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '340px' }}>
          Click on any email from your inbox to view full content, live spam classification, built-in translator, summary, and smart replies.
        </p>
      </div>
    );
  }

  const { security = {}, summary = {}, language = {}, smart_replies = {} } = email;
  const isSpam = security.is_spam;
  const riskScore = security.risk_score || 0;

  const currentReplyDraft = replyText || (smart_replies ? smart_replies[selectedTone] : '');

  const handleCopyReply = () => {
    navigator.clipboard.writeText(currentReplyDraft);
    setCopied(true);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.85 } });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleTranslateClick = async (langCode = targetLang) => {
    setTranslating(true);
    try {
      const res = await onTranslate(email.body, langCode);
      setTranslatedResult(res);
      setIsShowingTranslation(true);
    } catch (e) {
      console.error(e);
    } finally {
      setTranslating(false);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    const isSpamCorrected = feedbackCategory !== 'Clean / Safe';
    await onFeedback({
      email_id: email.id,
      original_category: security.category,
      user_marked_category: feedbackCategory,
      is_spam_corrected: isSpamCorrected,
      notes: feedbackNotes,
      rating: starRating
    });
    setFeedbackSubmitted(true);
    setTimeout(() => setFeedbackSubmitted(false), 3000);
  };

  return (
    <div className="glass-panel fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      
      {/* Top Banner: Spam Status & Threat Category Badge */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--border-subtle)',
        background: isSpam ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* SPAM CLASSIFICATION BADGE */}
            <span className={`badge ${isSpam ? 'badge-danger' : 'badge-safe'}`} style={{ fontSize: '0.85rem', padding: '5px 12px', fontWeight: '700' }}>
              {isSpam ? <ShieldAlert size={16} /> : <ShieldCheck size={16} />}
              {isSpam ? `SPAM DETECTED: ${security.category || 'Spam'}` : 'CLEAN & SAFE (NOT SPAM)'}
            </span>

            {/* Risk Score */}
            <span className="badge" style={{ background: 'var(--bg-secondary)', color: riskScore >= 50 ? '#ef4444' : '#10b981', border: '1px solid var(--border-subtle)', fontWeight: '700' }}>
              Threat Risk: {riskScore}%
            </span>

            {/* Language Tag */}
            <span className="badge" style={{ background: 'rgba(6, 182, 212, 0.12)', color: '#06b6d4', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
              <Globe size={12} /> Detected: {language.name || 'English'}
            </span>
          </div>

          <button
            onClick={() => onQuickStatusToggle(email.id, !isSpam)}
            className="btn btn-sm btn-secondary"
            style={{ fontSize: '0.75rem', padding: '5px 10px' }}
            title="Switch classification if incorrect"
          >
            {isSpam ? 'Mark as Not Spam (Safe)' : 'Mark as Spam'}
          </button>
        </div>

        {/* Email Subject */}
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px', lineHeight: '1.3' }}>
          {email.subject}
        </h2>

        {/* Sender & Date */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <User size={14} color="var(--text-muted)" />
            <strong>From:</strong> {email.sender}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={14} color="var(--text-muted)" />
            {new Date(email.date).toLocaleString()}
          </div>
        </div>
      </div>

      {/* BUILT-IN INSTANT TRANSLATOR BAR (Always easily accessible) */}
      <div style={{
        padding: '10px 20px',
        background: 'rgba(99, 102, 241, 0.08)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Languages size={17} color="var(--primary)" />
          <span style={{ fontSize: '0.825rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            Built-in Translator:
          </span>
          <select
            value={targetLang}
            onChange={(e) => {
              setTargetLang(e.target.value);
              handleTranslateClick(e.target.value);
            }}
            className="input-field"
            style={{ width: '170px', padding: '5px 10px', fontSize: '0.8rem', height: '32px' }}
          >
            {ALL_LANGUAGES.map(l => (
              <option key={l.code} value={l.code}>
                {l.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {isShowingTranslation && (
            <button
              onClick={() => setIsShowingTranslation(false)}
              className="btn btn-sm btn-secondary"
              style={{ fontSize: '0.75rem', padding: '4px 10px' }}
            >
              Show Original
            </button>
          )}
          <button
            onClick={() => handleTranslateClick(targetLang)}
            disabled={translating}
            className="btn btn-sm btn-primary"
            style={{ fontSize: '0.75rem', padding: '5px 12px' }}
          >
            {translating ? <RefreshCw size={13} className="pulse-animation" /> : <Languages size={13} />}
            {translating ? 'Translating...' : isShowingTranslation ? 'Re-Translate' : 'Translate Email'}
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '3px 16px',
        overflowX: 'auto',
        gap: '4px'
      }}>
        {[
          { id: 'reader', label: '📖 Email Content' },
          { id: 'security', label: '🛡️ Threat Audit', badge: isSpam ? 'Flagged' : 'Safe' },
          { id: 'summary', label: '📝 AI Summary', badge: summary.key_points?.length ? `${summary.key_points.length} pts` : null },
          { id: 'replies', label: '💬 Smart Replies' },
          { id: 'feedback', label: '✍️ Feedback' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="btn btn-sm"
            style={{
              background: activeTab === tab.id ? 'var(--bg-card)' : 'transparent',
              color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
              borderRadius: '6px 6px 0 0',
              fontWeight: activeTab === tab.id ? '700' : '500',
              padding: '7px 12px',
              fontSize: '0.8rem',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
            {tab.badge && (
              <span style={{
                fontSize: '0.65rem',
                padding: '1px 5px',
                borderRadius: '4px',
                background: 'rgba(99, 102, 241, 0.15)',
                color: 'var(--primary)',
                marginLeft: '4px'
              }}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div style={{ padding: '18px 20px', flex: 1, overflowY: 'auto' }}>

        {/* TAB: EMAIL CONTENT & TRANSLATION */}
        {activeTab === 'reader' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* If translation active */}
            {isShowingTranslation && translatedResult && (
              <div style={{
                background: 'rgba(99, 102, 241, 0.08)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                borderRadius: '10px',
                padding: '12px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '0.825rem', fontWeight: '700', color: '#818cf8' }}>
                  🌐 Viewing translation in {ALL_LANGUAGES.find(l => l.code === targetLang)?.name}
                </span>
                <button
                  onClick={() => setIsShowingTranslation(false)}
                  className="btn btn-sm btn-secondary"
                  style={{ fontSize: '0.725rem' }}
                >
                  Switch Back to Original ({language.name || 'English'})
                </button>
              </div>
            )}

            {/* Email Text Body */}
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '18px'
            }}>
              <pre style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.9rem',
                color: 'var(--text-primary)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                lineHeight: '1.65'
              }}>
                {isShowingTranslation && translatedResult ? translatedResult.translated_text : email.body}
              </pre>
            </div>

            {/* Quick Actions Footer inside Reader */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setActiveTab('summary')}
                className="btn btn-sm btn-secondary"
              >
                <Sparkles size={14} color="var(--primary)" />
                View AI Summary & Action Items
              </button>
              <button
                onClick={() => setActiveTab('replies')}
                className="btn btn-sm btn-secondary"
              >
                <MessageSquare size={14} color="#06b6d4" />
                Generate Smart Reply
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className="btn btn-sm btn-secondary"
              >
                <ShieldAlert size={14} color={isSpam ? '#ef4444' : '#10b981'} />
                Inspect Threat Details
              </button>
            </div>

          </div>
        )}

        {/* TAB: 🛡️ SECURITY AUDIT */}
        {activeTab === 'security' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
                  Classification & Risk Meter
                </span>
                <span style={{ fontSize: '0.9rem', fontWeight: '800', color: riskScore >= 50 ? '#ef4444' : '#10b981' }}>
                  {security.category || (isSpam ? 'Spam' : 'Clean')} ({riskScore}/100)
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.3)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  width: `${riskScore}%`,
                  height: '100%',
                  background: riskScore >= 70 ? '#ef4444' : riskScore >= 40 ? '#f59e0b' : '#10b981',
                  transition: 'width 0.5s ease'
                }} />
              </div>
            </div>

            {/* Threats Found */}
            {security.threats_found && security.threats_found.length > 0 && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '12px',
                padding: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#ef4444', fontWeight: '700', fontSize: '0.85rem' }}>
                  <AlertTriangle size={16} />
                  Flagged Threat Factors ({security.threats_found.length})
                </div>
                <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.825rem' }}>
                  {security.threats_found.map((threat, idx) => (
                    <li key={idx} style={{ color: '#fca5a5' }}>{threat}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* URLs Inspector */}
            {security.extracted_urls && security.extracted_urls.length > 0 && (
              <div style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '16px'
              }}>
                <div style={{ fontSize: '0.825rem', fontWeight: '700', marginBottom: '10px', color: 'var(--text-secondary)' }}>
                  Scanned Links ({security.extracted_urls.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {security.extracted_urls.map((url, i) => {
                    const isSuspicious = security.suspicious_urls?.includes(url);
                    return (
                      <div key={i} style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        background: isSuspicious ? 'rgba(239, 68, 68, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                        border: isSuspicious ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid var(--border-subtle)',
                        fontSize: '0.775rem',
                        fontFamily: 'var(--font-mono)',
                        color: isSuspicious ? '#f87171' : 'var(--text-primary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {isSuspicious ? '⚠️ [FLAGGED] ' : '🛡️ [SAFE] '} {url}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB: 📝 SUMMARIZATION */}
        {activeTab === 'summary' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.08) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '12px',
              padding: '16px 18px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: '#818cf8', fontWeight: '700', fontSize: '0.875rem' }}>
                <Sparkles size={16} />
                Short Executive Summary
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                {summary.tldr || 'No summary available.'}
              </p>
            </div>

            {/* Key Points */}
            {summary.key_points && summary.key_points.length > 0 && (
              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '10px', color: 'var(--text-secondary)' }}>
                  📌 Key Points
                </div>
                <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
                  {summary.key_points.map((pt, idx) => (
                    <li key={idx} style={{ color: 'var(--text-primary)' }}>{pt}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Dates & Deadlines */}
            {summary.dates_deadlines && summary.dates_deadlines.length > 0 && (
              <div style={{ background: 'rgba(6, 182, 212, 0.06)', border: '1px solid rgba(6, 182, 212, 0.25)', borderRadius: '12px', padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#06b6d4', fontWeight: '700', fontSize: '0.85rem' }}>
                  <Calendar size={16} /> Important Dates / Deadlines
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {summary.dates_deadlines.map((dt, idx) => (
                    <span key={idx} className="badge" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee', padding: '5px 10px', fontSize: '0.775rem' }}>
                      📅 {dt}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Items */}
            {summary.action_items && summary.action_items.length > 0 && (
              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: 'var(--text-secondary)', fontWeight: '700', fontSize: '0.85rem' }}>
                  <CheckSquare size={16} color="var(--primary)" /> Action Items Checklist
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {summary.action_items.map((action, idx) => (
                    <label key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.825rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={!!checkedActions[idx]}
                        onChange={() => setCheckedActions(prev => ({ ...prev, [idx]: !prev[idx] }))}
                        style={{ marginTop: '3px', accentColor: 'var(--primary)' }}
                      />
                      <span style={{ textDecoration: checkedActions[idx] ? 'line-through' : 'none', color: checkedActions[idx] ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                        {action}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB: 💬 SMART REPLIES */}
        {activeTab === 'replies' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            <div>
              <label style={{ fontSize: '0.785rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Select Reply Tone
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                {[
                  { id: 'professional', label: '👔 Professional' },
                  { id: 'friendly', label: '🤝 Friendly' },
                  { id: 'formal', label: '🏛️ Formal' },
                  { id: 'direct_decline', label: '🚫 Decline' }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedTone(t.id);
                      setReplyText(smart_replies[t.id] || '');
                    }}
                    className="btn btn-sm"
                    style={{
                      background: selectedTone === t.id ? 'var(--primary)' : 'var(--bg-secondary)',
                      color: selectedTone === t.id ? '#ffffff' : 'var(--text-secondary)',
                      border: selectedTone === t.id ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                      padding: '7px 8px',
                      fontSize: '0.75rem'
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
                  Generated Reply Draft
                </span>
                <button onClick={handleCopyReply} className="btn btn-sm btn-primary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  {copied ? 'Copied!' : 'Copy Reply'}
                </button>
              </div>

              <textarea
                value={currentReplyDraft}
                onChange={(e) => setReplyText(e.target.value)}
                rows={8}
                className="input-field"
                style={{ fontSize: '0.85rem', lineHeight: '1.5' }}
              />
            </div>

          </div>
        )}

        {/* TAB: ✍️ FEEDBACK */}
        {activeTab === 'feedback' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <form onSubmit={handleFeedbackSubmit} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Correct Category
                </label>
                <select
                  value={feedbackCategory}
                  onChange={(e) => setFeedbackCategory(e.target.value)}
                  className="input-field"
                  style={{ fontSize: '0.825rem' }}
                >
                  {ALL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Rating (1-5 Stars)
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <button key={s} type="button" onClick={() => setStarRating(s)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                      <Star size={20} fill={s <= starRating ? '#fbbf24' : 'transparent'} color={s <= starRating ? '#fbbf24' : 'var(--text-muted)'} />
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '9px', fontSize: '0.85rem' }}>
                <Send size={14} /> Submit Feedback
              </button>

              {feedbackSubmitted && (
                <div className="badge badge-safe" style={{ width: '100%', marginTop: '10px', padding: '8px', justifyContent: 'center' }}>
                  <Check size={14} /> Feedback saved!
                </div>
              )}
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
