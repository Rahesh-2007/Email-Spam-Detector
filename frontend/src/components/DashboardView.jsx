import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Mail, 
  AlertTriangle, 
  PieChart, 
  Activity, 
  TrendingUp, 
  Globe, 
  Zap,
  ArrowRight,
  Lock,
  FileText
} from 'lucide-react';

export default function DashboardView({ stats, emails, onSelectEmail, onViewInbox }) {
  const {
    total_emails = 0,
    spam_count = 0,
    clean_count = 0,
    spam_percentage = 0,
    average_risk_score = 0,
    category_distribution = {},
    threat_levels = {},
    language_distribution = {},
    security_health_score = 100
  } = stats || {};

  // Critical flagged emails
  const criticalThreats = (emails || []).filter(
    e => e.security && e.security.risk_score >= 75
  );

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Phishing Spam': return '#ef4444';
      case 'Financial Scam': return '#f97316';
      case 'Malicious Link Spam': return '#dc2626';
      case 'Lottery/Prize Spam': return '#eab308';
      case 'Job Spam': return '#a855f7';
      case 'Advertisement Spam': return '#3b82f6';
      case 'Clean / Safe': return '#10b981';
      default: return '#64748b';
    }
  };

  return (
    <div className="fade-in" style={{ padding: '0 20px 40px 20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Welcome & Security Banner */}
      <div className="glass-panel" style={{
        padding: '24px 30px',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ maxWidth: '650px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.4)' }}>
              <Activity size={13} /> Real-Time Security Intelligence
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Updated {new Date().toLocaleTimeString()}
            </span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '8px' }}>
            AI Email Security & Analytics Overview
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Intelligent neural threat analysis across your mailbox. Filtering phishing exploits, malicious links, multi-lingual scams, and generating executive summaries & replies.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onViewInbox} className="btn btn-primary" style={{ padding: '12px 20px' }}>
            <Mail size={16} />
            Explore Full Inbox ({total_emails})
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px' }}>
        {/* Total Scanned */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
              Total Scanned Emails
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mail size={18} color="#818cf8" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            {total_emails}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Active in current session
          </div>
        </div>

        {/* Spam Intercepted */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
              Threats & Spam Detected
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldAlert size={18} color="#ef4444" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#ef4444' }}>
              {spam_count}
            </div>
            <span className="badge badge-danger" style={{ fontSize: '0.75rem' }}>
              {spam_percentage}% of total
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Phishing, Scams, Ads & Malware
          </div>
        </div>

        {/* Clean Emails */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
              Verified Clean (Ham)
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={18} color="#10b981" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#10b981' }}>
            {clean_count}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Legitimate business & personal emails
          </div>
        </div>

        {/* Security Health Score */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
              Security Health Index
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={18} color="#06b6d4" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <div style={{ 
              fontSize: '2rem', 
              fontWeight: '800', 
              color: security_health_score >= 80 ? '#10b981' : security_health_score >= 50 ? '#f59e0b' : '#ef4444' 
            }}>
              {security_health_score}%
            </div>
            <span className="badge" style={{ 
              background: security_health_score >= 80 ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
              color: security_health_score >= 80 ? '#10b981' : '#f59e0b'
            }}>
              {security_health_score >= 80 ? 'Shielded' : 'Action Needed'}
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Avg Threat Risk: {average_risk_score}/100
          </div>
        </div>
      </div>

      {/* Main Charts & Category Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
        
        {/* Spam Categorization Breakdown */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <PieChart size={18} color="#818cf8" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700' }}>
              Spam Categorization Distribution
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(category_distribution).map(([category, count]) => {
              const pct = total_emails > 0 ? Math.round((count / total_emails) * 100) : 0;
              const barColor = getCategoryColor(category);

              return (
                <div key={category} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: barColor }} />
                      {category}
                    </span>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${pct}%`,
                      height: '100%',
                      background: barColor,
                      borderRadius: '4px',
                      transition: 'width 0.5s ease-in-out'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Threat Levels & Language Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Threat Levels Card */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <AlertTriangle size={18} color="#f59e0b" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700' }}>
                Threat Severity Levels
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {[
                { label: 'Critical Threat', count: threat_levels['Critical Threat'] || 0, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
                { label: 'High Risk', count: threat_levels['High Risk'] || 0, color: '#f97316', bg: 'rgba(249, 115, 22, 0.1)' },
                { label: 'Moderate Spam', count: threat_levels['Moderate'] || 0, color: '#eab308', bg: 'rgba(234, 179, 8, 0.1)' },
                { label: 'Safe / Clean', count: threat_levels['Safe'] || 0, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' }
              ].map(item => (
                <div key={item.label} style={{
                  padding: '12px 16px',
                  background: item.bg,
                  border: `1px solid ${item.color}33`,
                  borderRadius: '10px'
                }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '800', color: item.color, marginTop: '2px' }}>
                    {item.count}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Multilingual Detection Card */}
          <div className="glass-panel" style={{ padding: '20px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <Globe size={18} color="#06b6d4" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700' }}>
                Languages Detected in Mailbox
              </h3>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {Object.entries(language_distribution).map(([lang, count]) => (
                <div key={lang} style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.825rem'
                }}>
                  <span style={{ fontWeight: '600' }}>{lang}</span>
                  <span className="badge" style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', padding: '1px 6px' }}>
                    {count} emails
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Critical Threat Alerts Feed */}
      {criticalThreats.length > 0 && (
        <div className="glass-panel" style={{ padding: '24px', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldAlert size={20} color="#ef4444" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ef4444' }}>
                Urgent Security Alerts: High-Risk Attacks Detected
              </h3>
            </div>
            <span className="badge badge-danger">
              {criticalThreats.length} Action Required
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {criticalThreats.map(email => (
              <div 
                key={email.id}
                onClick={() => {
                  onSelectEmail(email);
                  onViewInbox();
                }}
                style={{
                  background: 'rgba(239, 68, 68, 0.06)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  borderRadius: '10px',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <span className="badge badge-danger" style={{ fontSize: '0.7rem' }}>
                      {email.security?.category || 'Phishing Attack'}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      From: {email.sender}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {email.subject}
                  </h4>
                  {email.security?.threats_found?.length > 0 && (
                    <p style={{ fontSize: '0.785rem', color: '#f87171', marginTop: '4px' }}>
                      ⚠️ {email.security.threats_found[0]}
                    </p>
                  )}
                </div>

                <button className="btn btn-sm btn-danger" style={{ flexShrink: 0 }}>
                  Inspect Threat
                  <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
