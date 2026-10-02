import React, { useState } from 'react';
import { 
  Shield, 
  Menu, 
  Search, 
  RefreshCw, 
  Database, 
  Sparkles, 
  LogOut, 
  User, 
  ChevronDown,
  X
} from 'lucide-react';

export default function Header({
  searchQuery,
  setSearchQuery,
  account,
  isDemo,
  onOpenConnectModal,
  onRefresh,
  loading,
  currentUser,
  onLogout,
  onToggleSidebar,
  onLoadDemo
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header style={{
      height: '64px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      gap: '16px'
    }}>
      {/* Left: Hamburger & Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '240px' }}>
        <button
          onClick={onToggleSidebar}
          title="Toggle main navigation"
          style={{
            background: 'none',
            border: 'none',
            color: '#4b5563',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.15s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <Menu size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #1a73e8 0%, #0284c7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(26, 115, 232, 0.25)'
          }}>
            <Shield size={20} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#1f2937', letterSpacing: '-0.02em' }}>
                IntelliGuard
              </span>
              <span style={{ fontSize: '1.15rem', fontWeight: '400', color: '#6b7280' }}>
                Mail
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Center: Gmail Style Search Bar */}
      <div style={{ flex: 1, maxWidth: '720px' }}>
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#edf2f7',
          borderRadius: '24px',
          padding: '0 16px',
          height: '44px',
          transition: 'all 0.2s ease',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)'
        }}>
          <Search size={18} color="#5f6368" style={{ marginRight: '12px', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search mail by sender, keyword, or threat indicator..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '0.9rem',
              color: '#1f2937',
              fontFamily: 'inherit'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                background: 'none',
                border: 'none',
                color: '#6b7280',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Right: Actions, Status & User Menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        
        {/* Status Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: '20px',
          backgroundColor: isDemo ? '#fffbeb' : '#f0fdf4',
          border: isDemo ? '1px solid #fde68a' : '1px solid #bbf7d0',
          fontSize: '0.775rem',
          fontWeight: '600',
          color: isDemo ? '#b45309' : '#15803d'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: isDemo ? '#f59e0b' : '#16a34a'
          }} />
          <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {isDemo ? 'Sandbox Demo' : account}
          </span>
        </div>

        {/* Connect IMAP button */}
        <button
          onClick={onOpenConnectModal}
          className="btn btn-secondary btn-sm"
          title="Connect Real Mailbox via IMAP"
        >
          <Database size={14} color="#1a73e8" />
          <span>Sync IMAP</span>
        </button>

        {/* Refresh button */}
        <button
          onClick={onRefresh}
          disabled={loading}
          className="btn btn-secondary btn-sm"
          title="Refresh / Reload Emails"
          style={{ padding: '8px' }}
        >
          <RefreshCw size={15} className={loading ? 'pulse-animation' : ''} />
        </button>

        {/* User Avatar & Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#1a73e8',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '0.9rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
            }}
          >
            {(currentUser?.name || currentUser?.email || 'U')[0].toUpperCase()}
          </button>

          {showUserMenu && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '46px',
              width: '240px',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              border: '1px solid #e2e8f0',
              padding: '12px',
              zIndex: 200
            }} className="fade-in">
              <div style={{ paddingBottom: '10px', borderBottom: '1px solid #e2e8f0', marginBottom: '8px' }}>
                <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#1f2937' }}>
                  {currentUser?.name || 'Security Analyst'}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentUser?.email || 'demo-sandbox@security.ai'}
                </div>
              </div>

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onLoadDemo();
                }}
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', justifyContent: 'flex-start', marginBottom: '6px' }}
              >
                <Sparkles size={14} color="#1a73e8" />
                Reset Demo Data
              </button>

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onLogout();
                }}
                className="btn btn-danger btn-sm"
                style={{ width: '100%', justifyContent: 'flex-start' }}
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
