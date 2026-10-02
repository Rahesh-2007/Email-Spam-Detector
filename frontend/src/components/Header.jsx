import React from 'react';
import { Shield, Sparkles, Mail, Moon, Sun, RefreshCw, Cpu, Database } from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  account, 
  isDemo, 
  onOpenConnectModal, 
  onRefresh, 
  loading, 
  theme, 
  toggleTheme,
  onLoadDemo
}) {
  return (
    <header className="glass-panel" style={{
      margin: '16px 20px',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '16px',
      position: 'sticky',
      top: '16px',
      zIndex: 50
    }}>
      {/* Brand & Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(99, 102, 241, 0.45)'
        }}>
          <Shield size={24} color="#ffffff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #f1f5f9 0%, #a5b4fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              IntelliGuard Mail AI
            </h1>
            <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.4)' }}>
              v2.0
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Intelligent Email Security & Multi-lingual AI Assistant
          </p>
        </div>
      </div>

      {/* Nav Tabs */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-secondary)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
        <button
          onClick={() => setActiveTab('dashboard')}
          className="btn btn-sm"
          style={{
            background: activeTab === 'dashboard' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'dashboard' ? '#fff' : 'var(--text-secondary)',
            fontWeight: activeTab === 'dashboard' ? '700' : '500'
          }}
        >
          <Cpu size={15} />
          7. Dashboard
        </button>
        <button
          onClick={() => setActiveTab('inbox')}
          className="btn btn-sm"
          style={{
            background: activeTab === 'inbox' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'inbox' ? '#fff' : 'var(--text-secondary)',
            fontWeight: activeTab === 'inbox' ? '700' : '500'
          }}
        >
          <Mail size={15} />
          8. Inbox & Security Feed
        </button>
        <button
          onClick={() => setActiveTab('manual')}
          className="btn btn-sm"
          style={{
            background: activeTab === 'manual' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'manual' ? '#fff' : 'var(--text-secondary)',
            fontWeight: activeTab === 'manual' ? '700' : '500'
          }}
        >
          <Sparkles size={15} />
          Manual AI Scanner
        </button>
      </nav>

      {/* Account Status & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--bg-secondary)',
          padding: '6px 12px',
          borderRadius: '8px',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.8rem'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: isDemo ? '#f59e0b' : '#10b981',
            boxShadow: `0 0 8px ${isDemo ? '#f59e0b' : '#10b981'}`
          }} />
          <span style={{ color: 'var(--text-secondary)', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {account || 'Not Connected'}
          </span>
          {isDemo && (
            <span className="badge badge-warning" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
              Sandbox Demo
            </span>
          )}
        </div>

        <button 
          onClick={onOpenConnectModal} 
          className="btn btn-secondary btn-sm"
          title="Connect your real email account via IMAP"
        >
          <Database size={14} />
          Connect IMAP
        </button>

        <button 
          onClick={onLoadDemo} 
          className="btn btn-secondary btn-sm"
          title="Load curated test emails covering all security scenarios"
        >
          <Sparkles size={14} color="#f59e0b" />
          Load Demo
        </button>

        <button 
          onClick={onRefresh} 
          disabled={loading}
          className="btn btn-secondary btn-sm"
          title="Refresh emails & sync"
        >
          <RefreshCw size={14} className={loading ? 'pulse-animation' : ''} />
        </button>

        <button 
          onClick={toggleTheme} 
          className="btn btn-secondary btn-sm"
          style={{ padding: '7px 10px' }}
          title="Toggle Light / Dark Mode"
        >
          {theme === 'dark' ? <Sun size={15} color="#fbbf24" /> : <Moon size={15} color="#6366f1" />}
        </button>
      </div>
    </header>
  );
}
