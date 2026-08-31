import React, { useState } from 'react';
import {
  ExternalLink,
  MapPin,
  FileText,
  LayoutGrid,
  Code2,
  ChevronDown,
  ChevronUp,
  Briefcase,
  GraduationCap,
  Award,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
} from 'lucide-react';
import type { ProfileResponse } from '../types/profile';
import { ExperienceList } from './ExperienceList';
import { EducationList } from './EducationList';
import { SkillsCloud } from './SkillsCloud';
import { CertificationsList } from './CertificationsList';
import { LanguagesList } from './LanguagesList';
import { MetaSection } from './MetaSection';
import { JsonViewer } from './JsonViewer';

interface ProfileViewProps {
  response: ProfileResponse;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ response }) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'json'>('visual');
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [aboutCopied, setAboutCopied] = useState(false);

  const profile = response.data;
  if (!profile) {
    return (
      <div className="glass-card card-section" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>No profile data available in response.</p>
      </div>
    );
  }

  // Get initials for avatar fallback (e.g. "MS" for Manan Shukla)
  const displayName = profile.name || [profile.firstName, profile.lastName].filter(Boolean).join(' ') || 'LinkedIn User';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('') || 'LI';

  const fullLocation = [
    profile.location?.city,
    profile.location?.region,
    profile.location?.country,
  ]
    .filter(Boolean)
    .join(', ') || profile.location?.raw;

  const handleCopyAbout = () => {
    if (!profile.about) return;
    navigator.clipboard.writeText(profile.about);
    setAboutCopied(true);
    setTimeout(() => setAboutCopied(false), 2000);
  };

  const expCount = profile.experience?.length || 0;
  const eduCount = profile.education?.length || 0;
  const skillsCount = profile.skills?.length || 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* View Switcher Tabs */}
      <div className="view-tabs">
        <button
          id="tab-visual"
          className={`tab-btn ${activeTab === 'visual' ? 'active' : ''}`}
          onClick={() => setActiveTab('visual')}
        >
          <LayoutGrid size={17} />
          Visual Dashboard
        </button>
        <button
          id="tab-json"
          className={`tab-btn ${activeTab === 'json' ? 'active' : ''}`}
          onClick={() => setActiveTab('json')}
        >
          <Code2 size={17} />
          Raw JSON Response
        </button>
      </div>

      {activeTab === 'json' ? (
        <JsonViewer data={response} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Main Profile Header Card */}
          <div className="glass-card">
            <div className="profile-banner">
              <div
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'rgba(10, 15, 26, 0.65)',
                  backdropFilter: 'blur(8px)',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.8rem',
                  color: 'var(--accent-cyan)',
                  fontWeight: 600,
                }}
              >
                <Sparkles size={14} />
                <span>Verified Public Profile</span>
              </div>
            </div>

            <div className="profile-header-body">
              <div className="avatar-wrapper">
                {profile.profileImage?.url ? (
                  <img
                    src={profile.profileImage.url}
                    alt={displayName}
                    className="avatar-img"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="avatar-fallback">{initials}</div>
                )}

                {profile.url && (
                  <a
                    id="view-on-linkedin-link"
                    href={profile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{ padding: '0.55rem 1.1rem', fontSize: '0.875rem', textDecoration: 'none' }}
                  >
                    <span>View on LinkedIn</span>
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>

              <div className="profile-main-info">
                <div className="profile-name">
                  <span>{displayName}</span>
                  {profile.id && (
                    <span
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: 'var(--accent-cyan)',
                        fontFamily: 'var(--font-mono)',
                        background: 'rgba(56, 189, 248, 0.08)',
                        border: '1px solid rgba(56, 189, 248, 0.2)',
                        padding: '0.2rem 0.65rem',
                        borderRadius: 'var(--radius-full)',
                      }}
                    >
                      @{profile.id}
                    </span>
                  )}
                </div>

                {profile.headline && <p className="profile-headline">{profile.headline}</p>}

                <div className="profile-meta-row">
                  {fullLocation && (
                    <div className="meta-item">
                      <MapPin size={15} style={{ color: 'var(--accent-cyan)' }} />
                      <span>{fullLocation}</span>
                    </div>
                  )}

                  {profile.firstName && profile.lastName && (
                    <div className="meta-item" style={{ fontSize: '0.8rem' }}>
                      <span>First: <strong>{profile.firstName}</strong> • Last: <strong>{profile.lastName}</strong></span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
            }}
          >
            <div className="glass-card" style={{ padding: '1.1rem 1.35rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(56, 189, 248, 0.1)',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-cyan)',
                }}
              >
                <Briefcase size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Experience</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{expCount} records</div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.1rem 1.35rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(168, 85, 247, 0.1)',
                  border: '1px solid rgba(168, 85, 247, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-purple)',
                }}
              >
                <GraduationCap size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Education</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{eduCount} records</div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.1rem 1.35rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-amber)',
                }}
              >
                <Award size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Skills</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{skillsCount} listed</div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.1rem 1.35rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-emerald)',
                }}
              >
                <CheckCircle2 size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#6ee7b7' }}>
                  {response.meta?.partial ? 'Partial' : 'Full Extraction'}
                </div>
              </div>
            </div>
          </div>

          {/* About / Summary Section */}
          {profile.about && (
            <div className="glass-card card-section">
              <div className="section-header">
                <h3 className="section-title">
                  <FileText size={18} style={{ color: 'var(--accent-cyan)' }} />
                  About & Summary
                </h3>
                <button
                  className="quick-chip-btn"
                  onClick={handleCopyAbout}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  {aboutCopied ? <Check size={13} style={{ color: 'var(--accent-emerald)' }} /> : <Copy size={13} />}
                  <span>{aboutCopied ? 'Copied' : 'Copy About'}</span>
                </button>
              </div>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.95rem',
                  lineHeight: '1.7',
                  whiteSpace: 'pre-line',
                  maxHeight: aboutExpanded ? 'none' : '150px',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                {profile.about}
              </p>
              {profile.about.length > 250 && (
                <button
                  className="link-btn"
                  style={{ marginTop: '0.75rem', background: 'transparent', border: 'none', cursor: 'pointer' }}
                  onClick={() => setAboutExpanded(!aboutExpanded)}
                >
                  {aboutExpanded ? (
                    <>
                      <span>Show less</span>
                      <ChevronUp size={15} />
                    </>
                  ) : (
                    <>
                      <span>Read full summary</span>
                      <ChevronDown size={15} />
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Sections List */}
          <div className="sections-grid">
            <ExperienceList experiences={profile.experience} />
            <EducationList education={profile.education} />
            <SkillsCloud skills={profile.skills} />
            <CertificationsList certifications={profile.certifications} />
            <LanguagesList languages={profile.languages} />
          </div>

          {/* Telemetry and Metadata */}
          <MetaSection meta={response.meta} />
        </div>
      )}
    </div>
  );
};
