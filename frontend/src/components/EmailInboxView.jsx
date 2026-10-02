import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ShieldAlert, 
  ShieldCheck, 
  Globe, 
  ArrowUpDown, 
  Inbox, 
  Star,
  CheckSquare,
  Square,
  Clock,
  Tag
} from 'lucide-react';
import EmailInspector from './EmailInspector';

const CATEGORY_CHIPS = [
  { id: 'all', label: 'All Mail' },
  { id: 'safe', label: 'Verified Safe' },
  { id: 'spam', label: 'All Threats' },
  { id: 'Phishing Spam', label: 'Phishing' },
  { id: 'Financial Scam', label: 'Financial' },
  { id: 'Job Spam', label: 'Job Spam' },
  { id: 'Lottery/Prize Spam', label: 'Lottery' },
  { id: 'Malicious Link Spam', label: 'Malicious Links' },
  { id: 'Advertisement Spam', label: 'Ads' }
];

export default function EmailInboxView({ 
  emails, 
  selectedEmail, 
  onSelectEmail, 
  onTranslate, 
  onFeedback, 
  onQuickStatusToggle,
  searchQuery,
  categoryFilter,
  setCategoryFilter
}) {
  const [languageFilter, setLanguageFilter] = useState('all');
  const [sortBy, setSortBy] = useState('risk_desc'); // 'risk_desc' | 'date_desc' | 'date_asc'
  const [starredIds, setStarredIds] = useState(new Set());
  const [selectedIds, setSelectedIds] = useState(new Set());

  const toggleStar = (id, e) => {
    e.stopPropagation();
    setStarredIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelect = (id, e) => {
    e.stopPropagation();
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Extract available detected languages
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
      if (searchQuery && searchQuery.trim()) {
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
      if (categoryFilter === 'critical' && (email.security?.risk_score || 0) < 75) return false;
      if (categoryFilter !== 'all' && categoryFilter !== 'spam' && categoryFilter !== 'safe' && categoryFilter !== 'critical') {
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
    <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }} className="fade-in">
      
      {/* Top Filter Chips & Controls Bar */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        {/* Category Filter Chips */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', alignItems: 'center' }}>
          {CATEGORY_CHIPS.map(chip => (
            <button
              key={chip.id}
              onClick={() => setCategoryFilter(chip.id)}
              style={{
                padding: '6px 12px',
                borderRadius: '16px',
                border: categoryFilter === chip.id ? '1px solid #1a73e8' : '1px solid #e2e8f0',
                backgroundColor: categoryFilter === chip.id ? '#e8f0fe' : '#ffffff',
                color: categoryFilter === chip.id ? '#1a73e8' : '#4b5563',
                fontWeight: categoryFilter === chip.id ? '700' : '500',
                fontSize: '0.775rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s'
              }}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Right: Language & Sort Dropdowns */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Language selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Globe size={15} color="#6b7280" />
            <select
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              className="input-field"
              style={{ width: '140px', fontSize: '0.8rem', padding: '6px 10px', height: '34px' }}
            >
              <option value="all">All Languages</option>
              {availableLanguages.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          {/* Sort selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ArrowUpDown size={15} color="#6b7280" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field"
              style={{ width: '150px', fontSize: '0.8rem', padding: '6px 10px', height: '34px' }}
            >
              <option value="risk_desc">Highest Threat</option>
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Split Layout: Email List (Left) + Email Inspector (Right) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(360px, 460px) 1fr',
        gap: '16px',
        alignItems: 'start'
      }}>
        
        {/* Left Column: Email List */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          maxHeight: 'calc(100vh - 165px)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Header count bar */}
          <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#f8fafc'
          }}>
            <span style={{ fontSize: '0.825rem', fontWeight: '700', color: '#374151' }}>
              Showing {filteredEmails.length} of {emails.length} Emails
            </span>
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              Click to inspect & smart reply
            </span>
          </div>

          {/* Scrollable list items */}
          <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column' }}>
            {filteredEmails.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: '#9ca3af' }}>
                <Inbox size={36} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
                <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#4b5563' }}>No emails found</div>
                <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>Try adjusting your search query or filter</div>
              </div>
            ) : (
              filteredEmails.map((email) => {
                const isSelected = selectedEmail?.id === email.id;
                const isSpam = email.security?.is_spam;
                const riskScore = email.security?.risk_score || 0;
                const isStarred = starredIds.has(email.id);

                return (
                  <div
                    key={email.id}
                    onClick={() => onSelectEmail(email)}
                    style={{
                      padding: '14px 16px',
                      borderBottom: '1px solid #f1f5f9',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? '#e8f0fe' : '#ffffff',
                      borderLeft: isSelected ? '4px solid #1a73e8' : '4px solid transparent',
                      transition: 'background-color 0.12s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = '#f8fafc';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = '#ffffff';
                    }}
                  >
                    {/* Top Row: Sender, Star & Risk Score */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                        <button
                          onClick={(e) => toggleStar(email.id, e)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: isStarred ? '#f59e0b' : '#d1d5db',
                            padding: 0,
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <Star size={15} fill={isStarred ? '#f59e0b' : 'none'} />
                        </button>

                        <span style={{
                          fontSize: '0.85rem',
                          fontWeight: isSpam ? '700' : '600',
                          color: '#1f2937',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '220px'
                        }}>
                          {email.sender.split('<')[0].trim() || email.sender}
                        </span>
                      </div>

                      {/* Risk Score Pill */}
                      <span style={{
                        fontSize: '0.725rem',
                        fontWeight: '700',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        backgroundColor: isSpam ? '#fef2f2' : '#f0fdf4',
                        color: isSpam ? '#dc2626' : '#15803d',
                        border: isSpam ? '1px solid #fecaca' : '1px solid #bbf7d0'
                      }}>
                        {riskScore}% Risk
                      </span>
                    </div>

                    {/* Subject Line */}
                    <div style={{
                      fontSize: '0.85rem',
                      fontWeight: isSelected ? '700' : '600',
                      color: isSelected ? '#1a73e8' : '#374151',
                      marginBottom: '6px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {email.subject}
                    </div>

                    {/* Body Snippet */}
                    <div style={{
                      fontSize: '0.775rem',
                      color: '#6b7280',
                      lineHeight: '1.4',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      marginBottom: '8px'
                    }}>
                      {email.body}
                    </div>

                    {/* Footer Row: Category badge, Language & Date */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.725rem' }}>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span style={{
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: isSpam ? '#fee2e2' : '#dcfce7',
                          color: isSpam ? '#b91c1c' : '#166534',
                          fontWeight: '600'
                        }}>
                          {email.security?.category || 'Clean'}
                        </span>
                        
                        {email.language?.name && (
                          <span style={{
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: '#f1f5f9',
                            color: '#475569'
                          }}>
                            {email.language.name.split('(')[0].trim()}
                          </span>
                        )}
                      </div>

                      <span style={{ color: '#9ca3af' }}>
                        {email.date ? new Date(email.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Today'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Email Inspector & AI Assistant */}
        <div style={{ position: 'sticky', top: '80px' }}>
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
