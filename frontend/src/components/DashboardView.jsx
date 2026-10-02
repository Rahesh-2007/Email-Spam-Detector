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
      case 'Phishing Spam': return '#dc2626';
      case 'Financial Scam': return '#ea580c';
      case 'Malicious Link Spam': return '#b91c1c';
      case 'Lottery/Prize Spam': return '#d97706';
      case 'Job Spam': return '#7c3aed';
      case 'Advertisement Spam': return '#2563eb';
      case 'Clean / Safe': return '#16a34a';
      default: return '#6b7280';
    }
  };

  return (
    <div className="fade-in" style={{ padding: '20px 24px 40px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Welcome & Security Banner */}
      <div style={{
        padding: '24px 28px',
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ maxWidth: '650px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#eff6ff',
              color: '#1a73e8',
              border: '1px solid #bfdbfe',
              fontSize: '0.75rem',
              fontWeight: '700',
              padding: '3px 10px',
              borderRadius: '20px'
            }}>
              <Activity size={13} /> Real-Time Security Intelligence
            </span>
            <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
              Updated {new Date().toLocaleTimeString()}
            </span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1f2937', letterSpacing: '-0.02em', marginBottom: '8px' }}>
            AI Email Security & Analytics Overview
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#4b5563', lineHeight: '1.5', margin: 0 }}>
            Intelligent neural threat analysis across your mailbox. Filtering phishing exploits, malicious links, multi-lingual scams, and generating executive summaries & smart replies.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onViewInbox} className="btn btn-primary" style={{ padding: '10px 18px' }}>
            <Mail size={16} />
            Explore Full Inbox ({total_emails})
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        
        {/* Total Scanned */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: '#4b5563', fontWeight: '600' }}>
              Total Scanned
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mail size={18} color="#1a73e8" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#1f2937' }}>
            {total_emails}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>
            Emails in current session
          </div>
        </div>

        {/* Spam Intercepted */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: '#4b5563', fontWeight: '600' }}>
              Threats & Spam Flagged
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldAlert size={18} color="#dc2626" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#dc2626' }}>
              {spam_count}
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#dc2626' }}>
              ({spam_percentage}%)
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>
            Multi-factor flagged threats
          </div>
        </div>

        {/* Clean Verified */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: '#4b5563', fontWeight: '600' }}>
              Clean Messages
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={18} color="#16a34a" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#16a34a' }}>
            {clean_count}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>
            Verified safe emails
          </div>
        </div>

        {/* Security Health Score */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: '#4b5563', fontWeight: '600' }}>
              Security Health Index
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#faf5ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={18} color="#7c3aed" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#7c3aed' }}>
              {security_health_score}/100
            </div>
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', marginTop: '8px', overflow: 'hidden' }}>
            <div style={{
              width: `${security_health_score}%`,
              height: '100%',
              backgroundColor: '#7c3aed'
            }} />
          </div>
        </div>

      </div>

      {/* Main Grid: Category Distribution & Critical Threat Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        
        {/* Category Breakdown */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <PieChart size={18} color="#1a73e8" />
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>
              Threat Categorization Breakdown
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.keys(category_distribution).length === 0 ? (
              <div style={{ color: '#6b7280', fontSize: '0.85rem', textAlign: 'center', padding: '20px 0' }}>
                No categories scanned yet
              </div>
            ) : (
              Object.entries(category_distribution).map(([cat, count]) => {
                const percentage = total_emails > 0 ? Math.round((count / total_emails) * 100) : 0;
                const color = getCategoryColor(cat);
                return (
                  <div key={cat}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '4px' }}>
                      <span style={{ fontWeight: '600', color: '#374151' }}>{cat}</span>
                      <span style={{ color: '#6b7280' }}>
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${percentage}%`,
                        height: '100%',
                        backgroundColor: color,
                        borderRadius: '4px',
                        transition: 'width 0.5s ease'
                      }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Critical Threat Alert Feed */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} color="#dc2626" />
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                High-Severity Threat Feed
              </h3>
            </div>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              padding: '2px 8px',
              borderRadius: '12px',
              backgroundColor: '#fee2e2',
              color: '#dc2626'
            }}>
              {criticalThreats.length} Critical
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '340px', overflowY: 'auto' }}>
            {criticalThreats.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 20px', color: '#16a34a' }}>
                <ShieldCheck size={36} style={{ margin: '0 auto 8px auto' }} />
                <div style={{ fontWeight: '600' }}>No Critical Threats Active</div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Your mailbox is free of high-risk exploits.</div>
              </div>
            ) : (
              criticalThreats.map((threat) => (
                <div
                  key={threat.id}
                  onClick={() => {
                    onSelectEmail(threat);
                    onViewInbox();
                  }}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    backgroundColor: '#fff5f5',
                    border: '1px solid #fed7d7',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.825rem', fontWeight: '700', color: '#9b2c2c' }}>
                      {threat.security?.category || 'Exploit Flagged'}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#dc2626' }}>
                      {threat.security?.risk_score}% Risk
                    </span>
                  </div>
                  <div style={{ fontSize: '0.825rem', fontWeight: '600', color: '#1f2937', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {threat.subject}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    Sender: {threat.sender}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
