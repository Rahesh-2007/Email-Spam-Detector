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
        port: Number(port),
        limit: Number(limit)
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Connection failed.');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.45)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      zIndex: 1000
    }} className="fade-in">
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        width: '100%',
        maxWidth: '520px',
        padding: '24px 28px',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            right: '20px',
            top: '20px',
            background: 'none',
            border: 'none',
            color: '#6b7280',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            backgroundColor: '#eff6ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Server size={22} color="#1a73e8" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1f2937', margin: 0 }}>
              Connect Mailbox via IMAP
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '2px 0 0 0' }}>
              Secure SSL/TLS sync for Gmail, Outlook, Yahoo or custom mail
            </p>
          </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '0.825rem',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Provider Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
              Select Email Provider
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
              {[
                { id: 'gmail', label: 'Gmail' },
                { id: 'outlook', label: 'Outlook' },
                { id: 'yahoo', label: 'Yahoo' },
                { id: 'custom', label: 'Custom' }
              ].map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleProviderSelect(p.id)}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    border: provider === p.id ? '2px solid #1a73e8' : '1px solid #e2e8f0',
                    backgroundColor: provider === p.id ? '#eff6ff' : '#ffffff',
                    color: provider === p.id ? '#1a73e8' : '#4b5563',
                    fontWeight: provider === p.id ? '700' : '500',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@gmail.com"
                className="input-field"
                style={{ paddingLeft: '38px' }}
                required
              />
            </div>
          </div>

          {/* Password / App Password */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#374151' }}>
                {provider === 'gmail' ? 'Gmail App Password (16 characters)' : 'Password / App Password'}
              </label>
              {provider === 'gmail' && (
                <button
                  type="button"
                  onClick={() => setShowHelp(!showHelp)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#1a73e8',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <HelpCircle size={13} />
                  Help Guide
                </button>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={provider === 'gmail' ? 'xxxx xxxx xxxx xxxx' : '••••••••••••'}
                className="input-field"
                style={{ paddingLeft: '38px' }}
                required
              />
            </div>
          </div>

          {/* Help box for Gmail App Passwords */}
          {provider === 'gmail' && showHelp && (
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '12px 14px',
              fontSize: '0.775rem',
              color: '#4b5563'
            }}>
              <div style={{ fontWeight: '700', color: '#1f2937', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Key size={14} color="#1a73e8" /> How to generate a 16-character Gmail App Password:
              </div>
              <ol style={{ paddingLeft: '18px', margin: '4px 0 0 0', lineHeight: '1.6' }}>
                <li>Open your <strong>Google Account</strong> (myaccount.google.com).</li>
                <li>Go to <strong>Security</strong> and ensure <strong>2-Step Verification</strong> is ON.</li>
                <li>Search "App Passwords" in the top bar.</li>
                <li>Create one named <em>IntelliGuard</em> and paste the 16 characters here.</li>
              </ol>
            </div>
          )}

          {/* Server Host & Port */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                IMAP Server Host
              </label>
              <input
                type="text"
                value={serverHost}
                onChange={(e) => setServerHost(e.target.value)}
                className="input-field"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                Port (SSL)
              </label>
              <input
                type="number"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                className="input-field"
                required
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={onConnectDemo}
              className="btn btn-secondary"
              style={{ flex: 1 }}
            >
              <Sparkles size={15} color="#f59e0b" />
              Use Sandbox Demo
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ flex: 1.2 }}
            >
              {loading ? 'Connecting...' : 'Connect Mailbox'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
