import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ShieldAlert, 
  ShieldCheck, 
  Globe, 
  ArrowUpDown, 
  Inbox, 
  Tag, 
  Sparkles,
  User,
  Calendar
} from 'lucide-react';
import EmailInspector from './EmailInspector';

const CATEGORY_FILTERS = [
  { id: 'all', label: 'All Emails' },
  { id: 'spam', label: '🚨 All Spam' },
  { id: 'safe', label: '🛡️ Safe Only' },
  { id: 'Phishing Spam', label: '🎣 Phishing' },
  { id: 'Financial Scam', label: '💰 Financial Scam' },
  { id: 'Job Spam', label: '💼 Job Spam' },
  { id: 'Lottery/Prize Spam', label: '🎟️ Lottery Spam' },
  { id: 'Malicious Link Spam', label: '🔗 Malicious Links' },
  { id: 'Advertisement Spam', label: '🏷️ Ads' }
];

export default function EmailInboxView({ 
  emails, 
  selectedEmail, 
  onSelectEmail, 
  onTranslate, 
  onFeedback, 
  onQuickStatusToggle 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [sortBy, setSortBy] = useState('risk_desc'); // 'risk_desc' | 'date_desc' | 'date_asc'

  // Extract all available detected languages from current emails
  const availableLanguages = useMemo(() => {
    const langs = new Set();
    (emails || []).forEach(e => {
      if (e.language?.name) langs.add(e.language.name);
    });
    return Array.from(langs);
  }, [emails]);

  // Filter and sort emails
  const filteredEmails = useMemo(() => {
    return (emails || []).filter(email => {
      // 1. Search query match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const subject = (email.subject || '').toLowerCase();
        const sender = (email.sender || '').toLowerCase();
        const body = (email.body || '').toLowerCase();
        if (!subject.includes(query) && !sender.includes(query) && !body.includes(query)) {
          return false;
        }
      }

      // 2. Category filter
      const isSpam = email.security?.is_spam;
      const category = email.security?.category;
      if (categoryFilter === 'spam' && !isSpam) return false;
      if (categoryFilter === 'safe' && isSpam) return false;
      if (categoryFilter !== 'all' && categoryFilter !== 'spam' && categoryFilter !== 'safe') {
        if (category !== categoryFilter) return false;
      }

      // 3. Language filter
      if (languageFilter !== 'all') {
        if (email.language?.name !== languageFilter) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'risk_desc') {
        return (b.security?.risk_score || 0) - (a.security?.risk_score || 0);
      }
      if (sortBy === 'date_desc') {
        return new Date(b.date || 0) - new Date(a.date || 0);
      }
      if (sortBy === 'date_asc') {
        return new Date(a.date || 0) - new Date(b.date || 0);
      }
      return 0;
    });
  }, [emails, searchQuery, categoryFilter, languageFilter, sortBy]);

  return (
    <div className="fade-in" style={{ padding: '0 20px 30px 20px' }}>
      
      {/* Search & Filter Toolbar */}
      <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        
        {/* Top Search Input & Controls */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '14px' }}>
          {/* Search bar */}
          <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by sender, subject keyword, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '38px', fontSize: '0.85rem' }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '0.75rem'
                }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Language selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={16} color="var(--text-muted)" />
            <select
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              className="input-field"
              style={{ width: '150px', fontSize: '0.825rem', padding: '8px 12px' }}
            >
              <option value="all">All Languages</option>
              {availableLanguages.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          {/* Sort selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowUpDown size={16} color="var(--text-muted)" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field"
              style={{ width: '160px', fontSize: '0.825rem', padding: '8px 12px' }}
            >
              <option value="risk_desc">Sort: Highest Threat</option>
              <option value="date_desc">Sort: Newest First</option>
              <option value="date_asc">Sort: Oldest First</option>
            </select>
          </div>
        </div>

        {/* Filter Chips Bar */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {CATEGORY_FILTERS.map(chip => (
            <button
              key={chip.id}
              onClick={() => setCategoryFilter(chip.id)}
              className="btn btn-sm"
              style={{
                background: categoryFilter === chip.id ? 'var(--primary)' : 'var(--bg-secondary)',
                color: categoryFilter === chip.id ? '#ffffff' : 'var(--text-secondary)',
                border: categoryFilter === chip.id ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                fontSize: '0.775rem',
                padding: '6px 12px',
                whiteSpace: 'nowrap'
              }}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Layout: Email List (Left) + Email Inspector (Right) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(320px, 420px) 1fr',
        gap: '20px',
        alignItems: 'start'
      }}>
        
        {/* Left Column: Email List */}
        <div className="glass-panel" style={{
          maxHeight: 'calc(100vh - 250px)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Header count */}
          <div style={{
            padding: '14px 18px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--bg-secondary)'
          }}>
            <span style={{ fontSize: '0.825rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
              Showing {filteredEmails.length} of {emails.length} Emails
            </span>
          </div>

          {/* Scrollable list items */}
          <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column' }}>
            {filteredEmails.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Inbox size={32} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
                <p style={{ fontSize: '0.85rem' }}>No emails match your filter criteria.</p>
              </div>
            ) : (
              filteredEmails.map(email => {
                const isSelected = selectedEmail?.id === email.id;
                const isSpam = email.security?.is_spam;
                const risk = email.security?.risk_score || 0;

                return (
                  <div
                    key={email.id}
                    onClick={() => onSelectEmail(email)}
                    style={{
                      padding: '14px 18px',
                      borderBottom: '1px solid var(--border-subtle)',
                      background: isSelected 
                        ? 'rgba(99, 102, 241, 0.16)' 
                        : 'transparent',
                      borderLeft: isSelected 
                        ? '4px solid var(--primary)' 
                        : isSpam 
                          ? '4px solid #ef4444' 
                          : '4px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {/* Top row: Badges & Date */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span className={`badge ${isSpam ? 'badge-danger' : 'badge-safe'}`} style={{ fontSize: '0.675rem', padding: '2px 6px' }}>
                          {isSpam ? <ShieldAlert size={11} /> : <ShieldCheck size={11} />}
                          {isSpam ? email.security?.category || 'Spam' : 'Clean'}
                        </span>
                        {email.language?.name && (
                          <span className="badge" style={{ fontSize: '0.65rem', background: 'var(--bg-secondary)', color: 'var(--text-muted)', padding: '2px 5px' }}>
                            {email.language.name}
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                        {new Date(email.date).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Sender */}
                    <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {email.sender}
                    </div>

                    {/* Subject */}
                    <div style={{ fontSize: '0.875rem', fontWeight: isSelected ? '700' : '600', color: 'var(--text-primary)', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {email.subject}
                    </div>

                    {/* Preview snippet */}
                    <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {email.body.slice(0, 100)}...
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Detailed Inspector */}
        <div style={{ minHeight: '620px' }}>
          <EmailInspector
            email={selectedEmail}
            onTranslate={onTranslate}
            onFeedback={onFeedback}
            onQuickStatusToggle={onQuickStatusToggle}
          />
        </div>

      </div>

    </div>
  );
}
