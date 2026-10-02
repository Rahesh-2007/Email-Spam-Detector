import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LoginPage from './components/LoginPage';
import DashboardView from './components/DashboardView';
import EmailInboxView from './components/EmailInboxView';
import ManualAnalyzerView from './components/ManualAnalyzerView';
import ImapConnectModal from './components/ImapConnectModal';
import ComposeModal from './components/ComposeModal';

const API_BASE = 'http://127.0.0.1:5000/api';

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('intelliguard_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Navigation & View State
  const [activeTab, setActiveTab] = useState('inbox'); // 'inbox' | 'dashboard' | 'manual'
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Mailbox Data State
  const [account, setAccount] = useState('demo-sandbox@security.ai');
  const [isDemo, setIsDemo] = useState(true);
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  // Modals
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

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
    if (currentUser) {
      loadDemoData();
    }
  }, [currentUser]);

  // Login Handlers
  const handleLoginDemo = async () => {
    const demoUser = {
      email: 'demo-sandbox@security.ai',
      name: 'Security Analyst',
      isDemo: true
    };
    setCurrentUser(demoUser);
    localStorage.setItem('intelliguard_user', JSON.stringify(demoUser));
    await loadDemoData();
  };

  const handleLoginAccount = async (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('intelliguard_user', JSON.stringify(userData));
    await loadDemoData();
  };

  const handleLoginImap = async (credentials) => {
    await handleConnectImap(credentials);
    const imapUser = {
      email: credentials.email,
      name: credentials.email.split('@')[0],
      isDemo: false
    };
    setCurrentUser(imapUser);
    localStorage.setItem('intelliguard_user', JSON.stringify(imapUser));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('intelliguard_user');
    showToast('Signed out successfully');
  };

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

  // Add composed email to active inbox
  const handleAddToInbox = (scannedEmail) => {
    setEmails(prev => [scannedEmail, ...prev]);
    setSelectedEmail(scannedEmail);
    setActiveTab('inbox');
    showToast('Scanned email added to Inbox');
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

  // If not logged in, render the clean white LoginPage
  if (!currentUser) {
    return (
      <LoginPage
        onLoginDemo={handleLoginDemo}
        onLoginAccount={handleLoginAccount}
        onLoginImap={handleLoginImap}
        loading={loading}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f6f8fc', display: 'flex', flexDirection: 'column' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          padding: '12px 20px',
          backgroundColor: '#1f2937',
          color: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.25)',
          zIndex: 2000,
          fontSize: '0.875rem',
          fontWeight: '600'
        }} className="fade-in">
          {toastMessage}
        </div>
      )}

      {/* Gmail-Style Top Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        account={account}
        isDemo={isDemo}
        onOpenConnectModal={() => setIsConnectModalOpen(true)}
        onRefresh={loadDemoData}
        loading={loading}
        currentUser={currentUser}
        onLogout={handleLogout}
        onToggleSidebar={() => setIsSidebarCollapsed(prev => !prev)}
        onLoadDemo={loadDemoData}
      />

      {/* Main Gmail Layout: Left Navigation + Content Area */}
      <div style={{ display: 'flex', flex: 1 }}>
        
        {/* Left Side Navigation (Gmail Style) */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          emails={emails}
          stats={stats}
          currentUser={currentUser}
          onLogout={handleLogout}
          onOpenCompose={() => setIsComposeOpen(true)}
          isCollapsed={isSidebarCollapsed}
        />

        {/* Main Work Area */}
        <main style={{ flex: 1, minWidth: 0, overflowX: 'hidden' }}>
          {activeTab === 'inbox' && (
            <EmailInboxView
              emails={emails}
              selectedEmail={selectedEmail}
              onSelectEmail={(email) => setSelectedEmail(email)}
              onTranslate={handleTranslate}
              onFeedback={handleFeedback}
              onQuickStatusToggle={handleQuickStatusToggle}
              searchQuery={searchQuery}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
            />
          )}

          {activeTab === 'dashboard' && (
            <DashboardView
              stats={stats}
              emails={emails}
              onSelectEmail={(email) => {
                setSelectedEmail(email);
                setActiveTab('inbox');
              }}
              onViewInbox={() => setActiveTab('inbox')}
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
      </div>

      {/* Compose / Scan Modal */}
      <ComposeModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        onAnalyze={handleAnalyzeSingle}
        onAddToInbox={handleAddToInbox}
      />

      {/* IMAP Connect Modal */}
      <ImapConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        onConnect={handleConnectImap}
        onConnectDemo={loadDemoData}
        loading={loading}
      />

    </div>
  );
}
