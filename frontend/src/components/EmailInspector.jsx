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
  ExternalLink,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

const ALL_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'ta', name: 'Tamil (?????)' },
  { code: 'hi', name: 'Hindi (??????)' },
  { code: 'te', name: 'Telugu (??????)' },
  { code: 'ml', name: 'Malayalam (??????)' },
  { code: 'kn', name: 'Kannada (?????)' },
  { code: 'bn', name: 'Bengali (?????)' },
  { code: 'es', name: 'Spanish (EspaÃ±ol)' },
  { code: 'fr', name: 'French (FranÃ§ais)' },
  { code: 'de', name: 'German (Deutsch)' },
  { code: 'zh-cn', name: 'Chinese (Simplified)' },
  { code: 'ja', name: 'Japanese (???)' },
  { code: 'ar', name: 'Arabic (???????)' },
  { code: 'ru', name: 'Russian (???????)' }
];

const ALL_CATEGORIES = [
  'Clean / Safe',
  'Advertisement Spam',
  'Phishing Spam',
  'Financial Scam',
  'Job Spam',
  'Lottery/Prize Spam',
  'Malicious Link Spam',
  'Other Spam'
];

export default function EmailInspector({ email, onTranslate, onFeedback, onQuickStatusToggle }) {
  const [activeTab, setActiveTab] = useState('reader'); // 'reader' | 'security' | 'summary' | 'replies' | 'feedback'
  const [selectedTone, setSelectedTone] = useState('professional');
  const [copied, setCopied] = useState(false);
  const [replyText, setReplyText] = useState('');
  
  // Translation state
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
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
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
          backgroundColor: '#eff6ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px'
        }}>
          <Inbox size={32} color="#1a73e8" />
        </div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1f2937', marginBottom: '6px' }}>
          Select an Email to Inspect
        </h3>
        <p style={{ fontSize: '0.85rem', color: '#6b7280', maxWidth: '340px' }}>
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
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      maxHeight: 'calc(100vh - 165px)',
      overflow: 'hidden'
    }} className="fade-in">
      
      {/* Top Banner: Spam Status & Threat Category Badge */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #e2e8f0',
        backgroundColor: isSpam ? '#fff5f5' : '#f0fdf4'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* SPAM CLASSIFICATION BADGE */}
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              padding: '5px 12px',
              fontWeight: '700',
              borderRadius: '20px',
              backgroundColor: isSpam ? '#fee2e2' : '#dcfce7',
              color: isSpam ? '#b91c1c' : '#15803d',
              border: isSpam ? '1px solid #fecaca' : '1px solid #bbf7d0'
            }}>
              {isSpam ? <ShieldAlert size={16} /> : <ShieldCheck size={16} />}
              {isSpam ? `SPAM DETECTED: ${security.category || 'Threat'}` : 'VERIFIED SAFE (NOT SPAM)'}
            </span>

            {/* Risk Score */}
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              fontSize: '0.8rem',
              padding: '4px 10px',
              borderRadius: '16px',
              fontWeight: '700',
              backgroundColor: '#ffffff',
              color: riskScore >= 50 ? '#dc2626' : '#16a34a',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}>
              Risk Score: {riskScore}%
            </span>

            {/* Language Tag */}
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.8rem',
              padding: '4px 10px',
              borderRadius: '16px',
              backgroundColor: '#e0f2fe',
              color: '#0284c7',
              border: '1px solid #bae6fd'
            }}>
              <Globe size={13} /> {language.name || 'English'}
            </span>
          </div>

          <button
            onClick={() => onQuickStatusToggle(email.id, !isSpam)}
            className="btn btn-sm btn-secondary"
            style={{ fontSize: '0.75rem', padding: '5px 10px' }}
            title="Switch classification if incorrect"
          >
            {isSpam ? 'Mark as Safe' : 'Mark as Spam'}
          </button>
        </div>

        {/* Email Subject */}
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1f2937', marginBottom: '8px', lineHeight: '1.3' }}>
          {email.subject}
        </h2>

        {/* Sender & Date */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', fontSize: '0.825rem', color: '#4b5563' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <User size={14} color="#6b7280" />
            <strong>From:</strong> <span>{email.sender}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6b7280' }}>
            <Clock size={14} />
            {email.date ? new Date(email.date).toLocaleString() : 'Just now'}
          </div>
        </div>
      </div>

      {/* BUILT-IN INSTANT TRANSLATOR BAR */}
      <div style={{
        padding: '10px 20px',
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Languages size={16} color="#1a73e8" />
          <span style={{ fontSize: '0.825rem', fontWeight: '700', color: '#1f2937' }}>
            Translate:
          </span>
          <select
            value={targetLang}
            onChange={(e) => {
              setTargetLang(e.target.value);
              handleTranslateClick(e.target.value);
            }}
            className="input-field"
            style={{ width: '180px', padding: '4px 8px', fontSize: '0.8rem', height: '32px' }}
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
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
        padding: '0 16px',
        overflowX: 'auto',
        gap: '4px'
      }}>
        {[
          { id: 'reader', label: '?? Email Content' },
          { id: 'security', label: '??? Threat Audit', badge: isSpam ? 'Flagged' : 'Safe' },
          { id: 'summary', label: '? AI Summary', badge: summary.key_points?.length ? `${summary.key_points.length} pts` : null },
          { id: 'replies', label: '?? Smart Replies' },
          { id: 'feedback', label: '? Feedback' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 14px',
              border: 'none',
              backgroundColor: 'transparent',
              color: activeTab === tab.id ? '#1a73e8' : '#6b7280',
              borderBottom: activeTab === tab.id ? '2px solid #1a73e8' : '2px solid transparent',
              fontWeight: activeTab === tab.id ? '700' : '500',
              fontSize: '0.8rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {tab.label}
            {tab.badge && (
              <span style={{
                fontSize: '0.65rem',
                padding: '1px 6px',
                borderRadius: '10px',
                backgroundColor: tab.badge === 'Flagged' ? '#fee2e2' : '#e0e7ff',
                color: tab.badge === 'Flagged' ? '#dc2626' : '#4338ca',
                fontWeight: '700'
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
            
            {isShowingTranslation && translatedResult && (
              <div style={{
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '8px',
                padding: '10px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#1e40af' }}>
                  ?? Viewing translation in {ALL_LANGUAGES.find(l => l.code === targetLang)?.name}
                </span>
                <button
                  onClick={() => setIsShowingTranslation(false)}
                  className="btn btn-sm btn-secondary"
                  style={{ fontSize: '0.725rem', padding: '3px 8px' }}
                >
                  Switch Back to Original ({language.name || 'English'})
                </button>
              </div>
            )}

            {/* Email Text Body */}
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '18px'
            }}>
              <pre style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.9rem',
                color: '#1f2937',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                lineHeight: '1.65'
              }}>
                {isShowingTranslation && translatedResult ? translatedResult.translated_text : email.body}
              </pre>
            </div>

            {/* Quick Actions Footer inside Reader */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setActiveTab('summary')}
                className="btn btn-sm btn-secondary"
              >
                <Sparkles size={14} color="#1a73e8" />
                View AI Summary & Action Items
              </button>
              <button
                onClick={() => setActiveTab('replies')}
                className="btn btn-sm btn-secondary"
              >
                <MessageSquare size={14} color="#0284c7" />
                Generate Smart Reply
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className="btn btn-sm btn-secondary"
              >
                <ShieldAlert size={14} color={isSpam ? '#dc2626' : '#16a34a'} />
                Inspect Threat Details
              </button>
            </div>

          </div>
        )}

        {/* TAB: SECURITY AUDIT */}
        {activeTab === 'security' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Risk Meter */}
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#4b5563' }}>
                  Risk Score & Classification
                </span>
                <span style={{ fontSize: '0.9rem', fontWeight: '800', color: riskScore >= 50 ? '#dc2626' : '#16a34a' }}>
                  {security.category || (isSpam ? 'Spam' : 'Clean')} ({riskScore}/100)
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  width: `${riskScore}%`,
                  height: '100%',
                  backgroundColor: riskScore >= 70 ? '#dc2626' : riskScore >= 40 ? '#d97706' : '#16a34a',
                  transition: 'width 0.5s ease'
                }} />
              </div>
            </div>

            {/* Flagged Threat Factors */}
            {security.threats_found && security.threats_found.length > 0 && (
              <div style={{
                backgroundColor: '#fff5f5',
                border: '1px solid #fed7d7',
                borderRadius: '10px',
                padding: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#c53030', fontWeight: '700', fontSize: '0.85rem' }}>
                  <AlertTriangle size={16} />
                  Flagged Threat Factors ({security.threats_found.length})
                </div>
                <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.825rem' }}>
                  {security.threats_found.map((threat, idx) => (
                    <li key={idx} style={{ color: '#9b2c2c' }}>{threat}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* URLs Inspector */}
            {security.extracted_urls && security.extracted_urls.length > 0 && (
              <div style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '16px'
              }}>
                <div style={{ fontSize: '0.825rem', fontWeight: '700', marginBottom: '10px', color: '#4b5563' }}>
                  Scanned Links ({security.extracted_urls.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {security.extracted_urls.map((url, i) => {
                    const isSuspicious = security.suspicious_urls?.includes(url);
                    return (
                      <div key={i} style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        backgroundColor: isSuspicious ? '#fff5f5' : '#ffffff',
                        border: isSuspicious ? '1px solid #fed7d7' : '1px solid #e2e8f0',
                        fontSize: '0.775rem',
                        fontFamily: 'var(--font-mono)',
                        color: isSuspicious ? '#c53030' : '#1f2937',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        <strong>{isSuspicious ? '?? [MALICIOUS / SUSPICIOUS] ' : '? [VERIFIED SAFE] '}</strong>
                        {url}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB: SUMMARIZATION */}
        {activeTab === 'summary' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Executive Summary */}
            <div style={{
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '10px',
              padding: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: '#1a73e8', fontWeight: '700', fontSize: '0.875rem' }}>
                <Sparkles size={16} />
                Short Executive Summary (TL;DR)
              </div>
              <p style={{ fontSize: '0.875rem', color: '#1e3a8a', lineHeight: '1.5', margin: 0 }}>
                {summary.tldr || 'No summary available.'}
              </p>
            </div>

            {/* Key Points */}
            {summary.key_points && summary.key_points.length > 0 && (
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '10px', color: '#374151' }}>
                  ?? Key Points
                </div>
                <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
                  {summary.key_points.map((pt, idx) => (
                    <li key={idx} style={{ color: '#4b5563' }}>{pt}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Dates & Deadlines */}
            {summary.dates_deadlines && summary.dates_deadlines.length > 0 && (
              <div style={{ backgroundColor: '#f0fdfa', border: '1px solid #99f6e4', borderRadius: '10px', padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#0f766e', fontWeight: '700', fontSize: '0.85rem' }}>
                  <Calendar size={16} /> Extracted Dates & Deadlines
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {summary.dates_deadlines.map((dt, idx) => (
                    <span key={idx} style={{
                      backgroundColor: '#ccfbf1',
                      color: '#115e59',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.775rem',
                      fontWeight: '600'
                    }}>
                      ??? {dt}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Items */}
            {summary.action_items && summary.action_items.length > 0 && (
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#374151', fontWeight: '700', fontSize: '0.85rem' }}>
                  <CheckSquare size={16} color="#1a73e8" /> Action Items Checklist
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {summary.action_items.map((action, idx) => (
                    <label key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.825rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={!!checkedActions[idx]}
                        onChange={() => setCheckedActions(prev => ({ ...prev, [idx]: !prev[idx] }))}
                        style={{ marginTop: '3px', accentColor: '#1a73e8' }}
                      />
                      <span style={{ textDecoration: checkedActions[idx] ? 'line-through' : 'none', color: checkedActions[idx] ? '#9ca3af' : '#1f2937' }}>
                        {action}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB: SMART REPLIES */}
        {activeTab === 'replies' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#4b5563', display: 'block', marginBottom: '6px' }}>
                Choose Tone of Reply
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                {[
                  { id: 'professional', label: '?? Professional' },
                  { id: 'friendly', label: '?? Friendly' },
                  { id: 'formal', label: '?? Formal' },
                  { id: 'direct_decline', label: '? Decline' }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedTone(t.id);
                      setReplyText(smart_replies[t.id] || '');
                    }}
                    style={{
                      padding: '8px 4px',
                      borderRadius: '8px',
                      border: selectedTone === t.id ? '2px solid #1a73e8' : '1px solid #e2e8f0',
                      backgroundColor: selectedTone === t.id ? '#eff6ff' : '#ffffff',
                      color: selectedTone === t.id ? '#1a73e8' : '#4b5563',
                      fontWeight: selectedTone === t.id ? '700' : '500',
                      fontSize: '0.775rem',
                      cursor: 'pointer'
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#4b5563' }}>
                  AI Generated Reply
                </span>
                <button onClick={handleCopyReply} className="btn btn-sm btn-primary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  {copied ? 'Copied to Clipboard!' : 'Copy Reply'}
                </button>
              </div>

              <textarea
                value={currentReplyDraft}
                onChange={(e) => setReplyText(e.target.value)}
                rows={8}
                className="input-field"
                style={{ fontSize: '0.85rem', lineHeight: '1.5', backgroundColor: '#ffffff' }}
              />
            </div>

          </div>
        )}

        {/* TAB: FEEDBACK & TUNING */}
        {activeTab === 'feedback' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <form onSubmit={handleFeedbackSubmit} style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>
                  Correct Classification / Category
                </label>
                <select
                  value={feedbackCategory}
                  onChange={(e) => setFeedbackCategory(e.target.value)}
                  className="input-field"
                  style={{ backgroundColor: '#ffffff' }}
                >
                  {ALL_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>
                  Rating (1-5 Stars)
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setStarRating(star)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: star <= starRating ? '#f59e0b' : '#d1d5db',
                        padding: 0
                      }}
                    >
                      <Star size={20} fill={star <= starRating ? '#f59e0b' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>
                  Notes / Explanation for AI Retraining
                </label>
                <textarea
                  value={feedbackNotes}
                  onChange={(e) => setFeedbackNotes(e.target.value)}
                  placeholder="Explain why this email was misclassified or what indicator was missed..."
                  rows={3}
                  className="input-field"
                  style={{ backgroundColor: '#ffffff', fontSize: '0.825rem' }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-sm"
                style={{ width: '100%', padding: '9px' }}
              >
                {feedbackSubmitted ? '? Feedback Saved to Knowledge Store!' : 'Submit Feedback for AI Training'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
