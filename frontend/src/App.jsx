import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import EmailInboxView from './components/EmailInboxView';
import ManualAnalyzerView from './components/ManualAnalyzerView';
import ImapConnectModal from './components/ImapConnectModal';

const API_BASE = 'http://127.0.0.1:5000/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('inbox');
  const [account, setAccount] = useState('demo-sandbox@security.ai');
  const [isDemo, setIsDemo] = useState(true);
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('antigravity_theme') || 'dark');
  const [toastMessage, setToastMessage] = useState('');

  // Synchronize theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('antigravity_theme', theme);
  }, [theme]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Load demo sandbox data on startup
  const loadDemoData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/fetch-demo`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setAccount(data.account);
        setIsDemo(true);
        setEmails(data.emails || []);
        setStats(data.stats);
        if (data.emails && data.emails.length > 0) {
          setSelectedEmail(data.emails[0]);
        }
        showToast('Loaded Demo Sandbox with 10 test emails');
      }
    } catch (err) {
      console.error('Failed to load demo data:', err);
      showToast('Backend offline or connecting...');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDemoData();
  }, []);

  // Connect to IMAP
  const handleConnectImap = async (credentials) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication or connection failed.');
      }

      setAccount(data.account);
      setIsDemo(false);
      setEmails(data.emails || []);
      setStats(data.stats);
      if (data.emails && data.emails.length > 0) {
        setSelectedEmail(data.emails[0]);
      }
      setActiveTab('inbox');
      showToast(`Connected to ${data.account}! Fetched ${data.emails.length} emails.`);
    } finally {
      setLoading(false);
    }
  };

  // Analyze single manual email
  const handleAnalyzeSingle = async (emailObj) => {
    const res = await fetch(`${API_BASE}/analyze-single`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailObj)
    });
    const data = await res.json();
    if (data.success) {
      showToast('Email scanned successfully!');
      return data.email;
    }
    throw new Error('Analysis failed');
  };

  // Translate text
  const handleTranslate = async (text, targetLang) => {
    const res = await fetch(`${API_BASE}/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, target_lang: targetLang })
    });
    const data = await res.json();
    if (data.success) {
      showToast(`Translated to ${data.target_lang.toUpperCase()}`);
      return data;
    }
    throw new Error('Translation failed');
  };

  // Record user feedback
  const handleFeedback = async (feedbackData) => {
    const res = await fetch(`${API_BASE}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedbackData)
    });
    const data = await res.json();
    showToast('Feedback submitted to improve AI model!');
    return data;
  };

  // Quick toggle spam status
  const handleQuickStatusToggle = (emailId, isSpam) => {
    setEmails(prev => prev.map(e => {
      if (e.id === emailId) {
        const updated = {
          ...e,
          security: {
            ...e.security,
            is_spam: isSpam,
            category: isSpam ? (e.security.category === 'Clean / Safe' ? 'Other Spam' : e.security.category) : 'Clean / Safe'
          }
        };
        if (selectedEmail?.id === emailId) {
          setSelectedEmail(updated);
        }
        return updated;
      }
      return e;
    }));
    showToast(`Marked as ${isSpam ? 'Spam' : 'Safe'}`);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="glass-panel fade-in" style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          padding: '12px 20px',
          background: 'rgba(99, 102, 241, 0.9)',
          color: '#ffffff',
          borderRadius: '10px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
          zIndex: 2000,
          fontSize: '0.875rem',
          fontWeight: '600'
        }}>
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        account={account}
        isDemo={isDemo}
        onOpenConnectModal={() => setIsConnectModalOpen(true)}
        onRefresh={loadDemoData}
        loading={loading}
        theme={theme}
        toggleTheme={toggleTheme}
        onLoadDemo={loadDemoData}
      />

      {/* Main View Router */}
      <main style={{ flex: 1 }}>
        {activeTab === 'dashboard' && (
          <DashboardView
            stats={stats}
            emails={emails}
            onSelectEmail={(email) => setSelectedEmail(email)}
            onViewInbox={() => setActiveTab('inbox')}
          />
        )}

        {activeTab === 'inbox' && (
          <EmailInboxView
            emails={emails}
            selectedEmail={selectedEmail}
            onSelectEmail={(email) => setSelectedEmail(email)}
            onTranslate={handleTranslate}
            onFeedback={handleFeedback}
            onQuickStatusToggle={handleQuickStatusToggle}
          />
        )}

        {activeTab === 'manual' && (
          <ManualAnalyzerView
            onAnalyzeSingle={handleAnalyzeSingle}
            onTranslate={handleTranslate}
            onFeedback={handleFeedback}
          />
        )}
      </main>

      {/* IMAP Connect Modal */}
      <ImapConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        onConnect={handleConnectImap}
        onConnectDemo={loadDemoData}
        loading={loading}
      />

      {/* Footer */}
      <footer style={{
        padding: '16px 24px',
        textAlign: 'center',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        borderTop: '1px solid var(--border-subtle)',
        marginTop: 'auto'
      }}>
        IntelliGuard AI • Email Security & Multi-Lingual Assistant • React + Flask Architecture
      </footer>

    </div>
  );
}
