import React, { useState } from 'react';
import { 
  Shield, 
  Mail, 
  Lock, 
  Sparkles, 
  Server, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Key,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';

export default function LoginPage({ onLoginDemo, onLoginAccount, onLoginImap, loading }) {
  const [authMode, setAuthMode] = useState('demo'); // 'demo' | 'account' | 'imap'
  
  // Standard account state
  const [accountEmail, setAccountEmail] = useState('analyst@intelliguard.ai');
  const [accountPassword, setAccountPassword] = useState('security123');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [accountError, setAccountError] = useState('');

  // IMAP state
  const [imapProvider, setImapProvider] = useState('gmail');
  const [imapEmail, setImapEmail] = useState('');
  const [imapPassword, setImapPassword] = useState('');
  const [imapServer, setImapServer] = useState('imap.gmail.com');
  const [imapPort, setImapPort] = useState(993);
  const [imapLimit, setImapLimit] = useState(15);
  const [showImapHelp, setShowImapHelp] = useState(false);
  const [imapError, setImapError] = useState('');

  const handleProviderSelect = (provider) => {
    setImapProvider(provider);
    setImapError('');
    if (provider === 'gmail') {
      setServerHost('imap.gmail.com');
      setPort(993);
    } else if (provider === 'outlook') {
      setServerHost('outlook.office365.com');
      setPort(993);
    } else if (provider === 'yahoo') {
      setServerHost('imap.mail.yahoo.com');
      setPort(993);
    } else {
      setServerHost('');
      setPort(993);
    }
  };

  const handleAccountSubmit = (e) => {
    e.preventDefault();
    if (!accountEmail || !accountPassword) {
      setAccountError('Please enter both email and password.');
      return;
    }
    setAccountError('');
    onLoginAccount({
      email: accountEmail,
      name: accountEmail.split('@')[0],
      isDemo: false
    });
  };

  const handleImapSubmit = async (e) => {
    e.preventDefault();
    if (!imapEmail || !imapPassword) {
      setImapError('Please enter your email and password / App Password.');
      return;
    }
    setImapError('');
    try {
      await onLoginImap({
        email: imapEmail,
        password: imapPassword,
        server_host: imapServer,
        port: Number(imapPort),
        limit: Number(imapLimit)
      });
    } catch (err) {
      setImapError(err.message || 'Connection failed');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f6f8fc',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px'
    }}>
      {/* Container Box */}
      <div style={{
        width: '100%',
        maxWidth: '480px',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e2e8f0',
        padding: '36px 32px',
        margin: '0 auto'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #1a73e8 0%, #0284c7 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(26, 115, 232, 0.3)',
            marginBottom: '14px'
          }}>
            <Shield size={28} color="#ffffff" />
          </div>
          <h1 style={{
            fontSize: '1.45rem',
            fontWeight: '800',
            color: '#1f2937',
            letterSpacing: '-0.02em',
            margin: '0 0 6px 0'
          }}>
            IntelliGuard Mail AI
          </h1>
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            margin: 0
          }}>
            Intelligent Email Security & Threat Defense Platform
          </p>
        </div>

        {/* Auth Mode Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '6px',
          backgroundColor: '#f1f5f9',
          padding: '4px',
          borderRadius: '10px',
          marginBottom: '24px'
        }}>
          <button
            type="button"
            onClick={() => setAuthMode('demo')}
            style={{
              padding: '8px 10px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: authMode === 'demo' ? '700' : '500',
              backgroundColor: authMode === 'demo' ? '#ffffff' : 'transparent',
              color: authMode === 'demo' ? '#1a73e8' : '#64748b',
              boxShadow: authMode === 'demo' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            ⚡ Demo Sandbox
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('account')}
            style={{
              padding: '8px 10px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: authMode === 'account' ? '700' : '500',
              backgroundColor: authMode === 'account' ? '#ffffff' : 'transparent',
              color: authMode === 'account' ? '#1a73e8' : '#64748b',
              boxShadow: authMode === 'account' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            👤 Sign In
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('imap')}
            style={{
              padding: '8px 10px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: authMode === 'imap' ? '700' : '500',
              backgroundColor: authMode === 'imap' ? '#ffffff' : 'transparent',
              color: authMode === 'imap' ? '#1a73e8' : '#64748b',
              boxShadow: authMode === 'imap' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            📧 Live IMAP
          </button>
        </div>

        {/* Tab 1: Instant Demo Sandbox */}
        {authMode === 'demo' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '10px',
              padding: '16px',
              fontSize: '0.85rem',
              color: '#1e40af'
            }}>
              <div style={{ fontWeight: '700', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} color="#1a73e8" />
                Explore Without Credentials
              </div>
              <p style={{ margin: 0, color: '#3b82f6', lineHeight: '1.45' }}>
                Instant access to 10 preloaded realistic test emails: Phishing attacks, Tamil job offers, Hindi banking KYC scams, and clean corporate messages.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.825rem', color: '#4b5563' }}>
                <CheckCircle size={15} color="#16a34a" />
                <span>Real-time heuristic & neural spam scoring</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.825rem', color: '#4b5563' }}>
                <CheckCircle size={15} color="#16a34a" />
                <span>AI executive summaries & smart reply generation</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.825rem', color: '#4b5563' }}>
                <CheckCircle size={15} color="#16a34a" />
                <span>Multi-lingual threat analysis (Tamil, Hindi, English)</span>
              </div>
            </div>

            <button
              onClick={onLoginDemo}
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '0.95rem',
                fontWeight: '700',
                borderRadius: '10px',
                marginTop: '8px'
              }}
            >
              {loading ? (
                <>Loading Sandbox...</>
              ) : (
                <>
                  <Sparkles size={18} />
                  Launch Demo Sandbox
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        )}

        {/* Tab 2: Standard Account Sign-In */}
        {authMode === 'account' && (
          <form onSubmit={handleAccountSubmit} className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {accountError && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#b91c1c',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '0.825rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertCircle size={16} />
                {accountError}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  type="email"
                  value={accountEmail}
                  onChange={(e) => setAccountEmail(e.target.value)}
                  placeholder="analyst@intelliguard.ai"
                  className="input-field"
                  style={{ paddingLeft: '38px' }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={accountPassword}
                  onChange={(e) => setAccountPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-field"
                  style={{ paddingLeft: '38px', paddingRight: '38px' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#9ca3af',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.825rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4b5563', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              <span style={{ color: '#1a73e8', fontWeight: '500', cursor: 'pointer' }}>
                Need help?
              </span>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '0.95rem',
                fontWeight: '700',
                borderRadius: '10px'
              }}
            >
              Sign In to Mailbox
            </button>
          </form>
        )}

        {/* Tab 3: Direct IMAP Mailbox Sign-In */}
        {authMode === 'imap' && (
          <form onSubmit={handleImapSubmit} className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {imapError && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#b91c1c',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '0.825rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertCircle size={16} />
                {imapError}
              </div>
            )}

            {/* Provider Picker */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                Email Provider
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                {['gmail', 'outlook', 'yahoo', 'custom'].map(prov => (
                  <button
                    key={prov}
                    type="button"
                    onClick={() => handleProviderSelect(prov)}
                    style={{
                      padding: '8px 4px',
                      borderRadius: '8px',
                      border: imapProvider === prov ? '2px solid #1a73e8' : '1px solid #e2e8f0',
                      backgroundColor: imapProvider === prov ? '#eff6ff' : '#ffffff',
                      color: imapProvider === prov ? '#1a73e8' : '#4b5563',
                      fontWeight: imapProvider === prov ? '700' : '500',
                      fontSize: '0.75rem',
                      textTransform: 'capitalize',
                      cursor: 'pointer'
                    }}
                  >
                    {prov}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                Email Address
              </label>
              <input
                type="email"
                value={imapEmail}
                onChange={(e) => setImapEmail(e.target.value)}
                placeholder="your.email@gmail.com"
                className="input-field"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                {imapProvider === 'gmail' ? 'Gmail App Password (16 chars)' : 'Password / App Password'}
              </label>
              <input
                type="password"
                value={imapPassword}
                onChange={(e) => setImapPassword(e.target.value)}
                placeholder={imapProvider === 'gmail' ? 'xxxx xxxx xxxx xxxx' : '••••••••••••'}
                className="input-field"
                required
              />
            </div>

            {/* Help collapsible for Gmail App Password */}
            {imapProvider === 'gmail' && (
              <div style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '10px 12px'
              }}>
                <button
                  type="button"
                  onClick={() => setShowImapHelp(!showImapHelp)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    color: '#1a73e8',
                    fontSize: '0.775rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Key size={14} />
                    How to generate Gmail App Password?
                  </span>
                  {showImapHelp ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {showImapHelp && (
                  <ol style={{
                    margin: '8px 0 0 16px',
                    padding: 0,
                    fontSize: '0.75rem',
                    color: '#4b5563',
                    lineHeight: '1.5'
                  }}>
                    <li>Go to Google Account ➔ <strong>Security</strong>.</li>
                    <li>Ensure <strong>2-Step Verification</strong> is enabled.</li>
                    <li>Search <strong>App Passwords</strong>.</li>
                    <li>Create new named <em>IntelliGuard</em> and paste the 16-letter code.</li>
                  </ol>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '0.95rem',
                fontWeight: '700',
                borderRadius: '10px'
              }}
            >
              {loading ? 'Connecting over SSL...' : 'Connect Real Mailbox'}
            </button>
          </form>
        )}

        {/* Security Trust Badges */}
        <div style={{
          marginTop: '28px',
          paddingTop: '20px',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          color: '#6b7280',
          fontSize: '0.725rem'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={14} color="#16a34a" /> SSL Encrypted
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Lock size={14} color="#1a73e8" /> Zero Stored Locally
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={14} color="#8b5cf6" /> AI Assisted
          </span>
        </div>
      </div>
    </div>
  );
}
