import React, { useState } from 'react';
import { X, Lock, Mail, Server, ShieldCheck, AlertCircle, HelpCircle, ChevronDown, ChevronUp, Key, Sparkles } from 'lucide-react';

export default function ImapConnectModal({ isOpen, onClose, onConnect, onConnectDemo, loading }) {
  const [provider, setProvider] = useState('gmail');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [serverHost, setServerHost] = useState('imap.gmail.com');
  const [port, setPort] = useState(993);
  const [limit, setLimit] = useState(15);
  const [showHelp, setShowHelp] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleProviderSelect = (prov) => {
    setProvider(prov);
    setError('');
    if (prov === 'gmail') {
      setServerHost('imap.gmail.com');
      setPort(993);
    } else if (prov === 'outlook') {
      setServerHost('outlook.office365.com');
      setPort(993);
    } else if (prov === 'yahoo') {
      setServerHost('imap.mail.yahoo.com');
      setPort(993);
    } else {
      setServerHost('');
      setPort(993);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your email address and password (or App Password).');
      return;
    }
    setError('');
    try {
      await onConnect({
        email,
        password,
        server_host: serverHost,
        port: parseInt(port),
        limit: parseInt(limit),
        folder: 'INBOX'
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to authenticate with IMAP server.');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(5, 7, 13, 0.82)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="glass-panel fade-in" style={{
        width: '100%',
        maxWidth: '560px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '28px',
        position: 'relative',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Lock size={22} color="#818cf8" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Connect Your Email Account
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Fetch and scan your real inbox in real-time via secure SSL IMAP
            </p>
          </div>
        </div>

        {/* Provider Preset Buttons */}
        <div style={{ marginBottom: '18px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
            Choose Provider Preset
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {[
              { id: 'gmail', label: 'Gmail', host: 'imap.gmail.com' },
              { id: 'outlook', label: 'Outlook', host: 'outlook.office365.com' },
              { id: 'yahoo', label: 'Yahoo', host: 'imap.mail.yahoo.com' },
              { id: 'custom', label: 'Custom IMAP', host: 'Custom Host' }
            ].map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleProviderSelect(p.id)}
                className="btn btn-sm"
                style={{
                  background: provider === p.id ? 'rgba(99, 102, 241, 0.25)' : 'var(--bg-secondary)',
                  border: provider === p.id ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                  color: provider === p.id ? '#ffffff' : 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  padding: '8px'
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Help Banner for App Password */}
        <div style={{
          background: 'rgba(99, 102, 241, 0.08)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: '10px',
          padding: '12px 16px',
          marginBottom: '20px'
        }}>
          <button
            type="button"
            onClick={() => setShowHelp(!showHelp)}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#818cf8',
              fontSize: '0.825rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Key size={16} />
              Gmail / Outlook: How to generate an App Password?
            </span>
            {showHelp ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          {showHelp && (
            <div style={{ marginTop: '10px', fontSize: '0.785rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              <p style={{ marginBottom: '6px' }}>
                Major email providers (like Gmail & Yahoo) require a dedicated 16-character <strong>App Password</strong> instead of your normal account password when connecting through IMAP:
              </p>
              <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <li>Go to your <strong>Google Account</strong> (myaccount.google.com).</li>
                <li>Select <strong>Security</strong> on the left menu.</li>
                <li>Under "How you sign in to Google", enable <strong>2-Step Verification</strong>.</li>
                <li>Click <strong>App Passwords</strong>, name it "IntelliGuard Mail", and copy the generated 16-character code.</li>
                <li>Paste that 16-character password into the password field below.</li>
              </ol>
            </div>
          )}
        </div>

        {error && (
          <div style={{
            background: 'var(--danger-bg)',
            border: '1px solid var(--danger-border)',
            borderRadius: '10px',
            padding: '12px 14px',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            fontSize: '0.825rem',
            color: 'var(--danger-red)'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email field */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                placeholder="your.email@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '38px' }}
                required
              />
            </div>
          </div>

          {/* Password field */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Password / App Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                placeholder="••••••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '38px' }}
                required
              />
            </div>
          </div>

          {/* Server details */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                IMAP Host
              </label>
              <div style={{ position: 'relative' }}>
                <Server size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="imap.gmail.com"
                  value={serverHost}
                  onChange={(e) => setServerHost(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: '38px' }}
                />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Port (SSL)
              </label>
              <input
                type="number"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          {/* Email fetch limit */}
          <div style={{ marginBottom: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                Number of Emails to Fetch & Classify
              </label>
              <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '700' }}>
                {limit >= 100 ? 'All Available (Up to 100)' : `${limit} emails`}
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="10"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
          </div>

          {/* Submit Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
            >
              <ShieldCheck size={18} />
              {loading ? 'Connecting & Analyzing Emails with AI...' : 'Connect & Scan Inbox'}
            </button>

            <button
              type="button"
              onClick={() => {
                onConnectDemo();
                onClose();
              }}
              className="btn btn-secondary"
              style={{ width: '100%', padding: '10px', fontSize: '0.85rem' }}
            >
              <Sparkles size={16} color="#f59e0b" />
              Or Test with Curated Demo Sandbox (Instant)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
