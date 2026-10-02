import React from 'react';
import { 
  Inbox, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  FileText, 
  PieChart, 
  Sparkles, 
  Settings, 
  LogOut, 
  Plus, 
  Mail, 
  Flame, 
  Link, 
  DollarSign, 
  Briefcase, 
  Gift, 
  Megaphone, 
  Star,
  Activity
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  categoryFilter,
  setCategoryFilter,
  emails,
  stats,
  currentUser,
  onLogout,
  onOpenCompose,
  isCollapsed
}) {
  const totalEmails = (emails || []).length;
  const spamCount = (emails || []).filter(e => e.security?.is_spam).length;
  const safeCount = totalEmails - spamCount;
  const criticalCount = (emails || []).filter(e => e.security?.risk_score >= 75).length;

  const countCategory = (catName) => {
    return (emails || []).filter(e => e.security?.category === catName).length;
  };

  const handleSelectFolder = (catId) => {
    setActiveTab('inbox');
    setCategoryFilter(catId);
  };

  if (isCollapsed) {
    return (
      <aside style={{
        width: '64px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px 0',
        gap: '12px'
      }}>
        <button
          onClick={onOpenCompose}
          title="Compose & Scan Email"
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '16px',
            backgroundColor: '#c2e7ff',
            color: '#001d35',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0,0,0,0.15)'
          }}
        >
          <Plus size={22} />
        </button>

        <button
          onClick={() => handleSelectFolder('all')}
          title="Inbox"
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            border: 'none',
            backgroundColor: activeTab === 'inbox' && categoryFilter === 'all' ? '#d3e3fd' : 'transparent',
            color: activeTab === 'inbox' && categoryFilter === 'all' ? '#0b57d0' : '#4b5563',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Inbox size={20} />
        </button>

        <button
          onClick={() => handleSelectFolder('spam')}
          title="Spam & Threats"
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            border: 'none',
            backgroundColor: activeTab === 'inbox' && categoryFilter === 'spam' ? '#fee2e2' : 'transparent',
            color: activeTab === 'inbox' && categoryFilter === 'spam' ? '#dc2626' : '#4b5563',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ShieldAlert size={20} />
        </button>

        <button
          onClick={() => setActiveTab('dashboard')}
          title="Dashboard"
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            border: 'none',
            backgroundColor: activeTab === 'dashboard' ? '#d3e3fd' : 'transparent',
            color: activeTab === 'dashboard' ? '#0b57d0' : '#4b5563',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <PieChart size={20} />
        </button>
      </aside>
    );
  }

  return (
    <aside style={{
      width: '260px',
      minWidth: '260px',
      backgroundColor: '#ffffff',
      borderRight: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 65px)',
      position: 'sticky',
      top: '65px',
      overflowY: 'auto'
    }}>
      {/* Compose Button */}
      <div style={{ padding: '16px 16px 12px 16px' }}>
        <button
          onClick={onOpenCompose}
          className="btn-compose"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <Plus size={20} />
          <span>Compose & Scan</span>
        </button>
      </div>

      {/* Main Mail Navigation */}
      <div style={{ flex: 1, padding: '0 12px 16px 12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        
        {/* All Inbox */}
        <button
          onClick={() => handleSelectFolder('all')}
          className={`gmail-nav-item ${activeTab === 'inbox' && categoryFilter === 'all' ? 'active' : ''}`}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Inbox size={18} />
            <span>Inbox</span>
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: '700' }}>
            {totalEmails}
          </span>
        </button>

        {/* Verified Safe */}
        <button
          onClick={() => handleSelectFolder('safe')}
          className={`gmail-nav-item ${activeTab === 'inbox' && categoryFilter === 'safe' ? 'active' : ''}`}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ShieldCheck size={18} color="#16a34a" />
            <span>Verified Safe</span>
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#16a34a' }}>
            {safeCount}
          </span>
        </button>

        {/* All Spam */}
        <button
          onClick={() => handleSelectFolder('spam')}
          className={`gmail-nav-item ${activeTab === 'inbox' && categoryFilter === 'spam' ? 'active' : ''}`}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ShieldAlert size={18} color="#dc2626" />
            <span>Spam & Threats</span>
          </div>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: '700',
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            padding: '2px 8px',
            borderRadius: '10px'
          }}>
            {spamCount}
          </span>
        </button>

        {/* High Risk / Critical */}
        <button
          onClick={() => handleSelectFolder('critical')}
          className={`gmail-nav-item ${activeTab === 'inbox' && categoryFilter === 'critical' ? 'active' : ''}`}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Star size={18} color="#ea580c" />
            <span>High Risk (75%+)</span>
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#ea580c' }}>
            {criticalCount}
          </span>
        </button>

        {/* Subcategories Header */}
        <div style={{
          padding: '16px 12px 6px 12px',
          fontSize: '0.7rem',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: '#9ca3af'
        }}>
          Threat Categories
        </div>

        {/* Phishing */}
        <button
          onClick={() => handleSelectFolder('Phishing Spam')}
          className={`gmail-nav-item ${activeTab === 'inbox' && categoryFilter === 'Phishing Spam' ? 'active' : ''}`}
          style={{ paddingLeft: '24px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Flame size={16} color="#dc2626" />
            <span>Phishing</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            {countCategory('Phishing Spam')}
          </span>
        </button>

        {/* Financial */}
        <button
          onClick={() => handleSelectFolder('Financial Scam')}
          className={`gmail-nav-item ${activeTab === 'inbox' && categoryFilter === 'Financial Scam' ? 'active' : ''}`}
          style={{ paddingLeft: '24px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <DollarSign size={16} color="#ea580c" />
            <span>Financial Scam</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            {countCategory('Financial Scam')}
          </span>
        </button>

        {/* Malicious Links */}
        <button
          onClick={() => handleSelectFolder('Malicious Link Spam')}
          className={`gmail-nav-item ${activeTab === 'inbox' && categoryFilter === 'Malicious Link Spam' ? 'active' : ''}`}
          style={{ paddingLeft: '24px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link size={16} color="#b91c1c" />
            <span>Malicious Links</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            {countCategory('Malicious Link Spam')}
          </span>
        </button>

        {/* Job Spam */}
        <button
          onClick={() => handleSelectFolder('Job Spam')}
          className={`gmail-nav-item ${activeTab === 'inbox' && categoryFilter === 'Job Spam' ? 'active' : ''}`}
          style={{ paddingLeft: '24px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Briefcase size={16} color="#8b5cf6" />
            <span>Job Spam</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            {countCategory('Job Spam')}
          </span>
        </button>

        {/* Lottery / Prize */}
        <button
          onClick={() => handleSelectFolder('Lottery/Prize Spam')}
          className={`gmail-nav-item ${activeTab === 'inbox' && categoryFilter === 'Lottery/Prize Spam' ? 'active' : ''}`}
          style={{ paddingLeft: '24px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Gift size={16} color="#d97706" />
            <span>Lottery / Prize</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            {countCategory('Lottery/Prize Spam')}
          </span>
        </button>

        {/* Advertisement */}
        <button
          onClick={() => handleSelectFolder('Advertisement Spam')}
          className={`gmail-nav-item ${activeTab === 'inbox' && categoryFilter === 'Advertisement Spam' ? 'active' : ''}`}
          style={{ paddingLeft: '24px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Megaphone size={16} color="#2563eb" />
            <span>Advertisements</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            {countCategory('Advertisement Spam')}
          </span>
        </button>

        {/* Workspace Tools Divider */}
        <div style={{
          margin: '14px 8px 8px 8px',
          borderTop: '1px solid #e2e8f0',
          paddingTop: '12px',
          fontSize: '0.7rem',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: '#9ca3af'
        }}>
          AI Intelligence
        </div>

        {/* Dashboard View */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`gmail-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <PieChart size={18} />
            <span>Security Dashboard</span>
          </div>
        </button>

        {/* Manual Analyzer */}
        <button
          onClick={() => setActiveTab('manual')}
          className={`gmail-nav-item ${activeTab === 'manual' ? 'active' : ''}`}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Sparkles size={18} color="#7c3aed" />
            <span>Manual AI Scanner</span>
          </div>
        </button>
      </div>

      {/* Sidebar Footer: Health Widget & User Profile */}
      <div style={{
        padding: '14px 16px',
        borderTop: '1px solid #e2e8f0',
        backgroundColor: '#f8fafc'
      }}>
        {/* Security Health Indicator */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '600', color: '#4b5563', marginBottom: '4px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Activity size={13} color="#16a34a" /> Mailbox Protection
            </span>
            <span>{stats?.security_health_score ?? 92}%</span>
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              width: `${stats?.security_health_score ?? 92}%`,
              height: '100%',
              backgroundColor: '#16a34a',
              borderRadius: '3px'
            }} />
          </div>
        </div>

        {/* User Card */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#1a73e8',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '0.85rem',
              flexShrink: 0
            }}>
              {(currentUser?.name || currentUser?.email || 'U')[0].toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontSize: '0.8rem',
                fontWeight: '600',
                color: '#1f2937',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {currentUser?.name || 'Security Analyst'}
              </div>
              <div style={{
                fontSize: '0.7rem',
                color: '#6b7280',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {currentUser?.email || 'demo-sandbox@security.ai'}
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Sign Out"
            style={{
              background: 'none',
              border: 'none',
              color: '#dc2626',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
