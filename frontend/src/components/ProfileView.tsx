import React, { useState } from 'react';
import {
  ExternalLink,
  MapPin,
  FileText,
  LayoutGrid,
  Code2,
  ChevronDown,
  ChevronUp,
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

  const profile = response.data;
  if (!profile) {
    return (
      <div className="glass-card card-section" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>No profile data available in response.</p>
      </div>
    );
  }

  // Get initials for avatar fallback
  const initials = (profile.name || `${profile.firstName || ''} ${profile.lastName || ''}`)
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
            <div className="profile-banner" />
            <div className="profile-header-body">
              <div className="avatar-wrapper">
                {profile.profileImage?.url ? (
                  <img
                    src={profile.profileImage.url}
                    alt={profile.name || 'Profile Avatar'}
                    className="avatar-img"
                    onError={(e) => {
                      // fallback to initials on broken image
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
                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', textDecoration: 'none' }}
                  >
                    <span>View on LinkedIn</span>
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>

              <div className="profile-main-info">
                <div className="profile-name">
                  <span>{profile.name || `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'LinkedIn User'}</span>
                  {profile.id && (
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color: 'var(--text-muted)',
                        fontFamily: 'var(--font-mono)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '0.2rem 0.6rem',
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
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          {profile.about && (
            <div className="glass-card card-section">
              <div className="section-header">
                <h3 className="section-title">
                  <FileText size={18} style={{ color: 'var(--accent-cyan)' }} />
                  About
                </h3>
              </div>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.95rem',
                  lineHeight: '1.65',
                  whiteSpace: 'pre-line',
                  maxHeight: aboutExpanded ? 'none' : '120px',
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
                      <span>Read more</span>
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
