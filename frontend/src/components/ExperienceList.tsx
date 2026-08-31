import React from 'react';
import { Briefcase, MapPin, Calendar } from 'lucide-react';
import type { Experience } from '../types/profile';

interface ExperienceListProps {
  experiences?: Experience[];
}

export const ExperienceList: React.FC<ExperienceListProps> = ({ experiences = [] }) => {
  if (!experiences || experiences.length === 0) {
    return (
      <div className="glass-card card-section">
        <div className="section-header">
          <h3 className="section-title">
            <Briefcase size={18} style={{ color: 'var(--accent-cyan)' }} />
            Experience
            <span className="badge-count">0</span>
          </h3>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No experience records listed.</p>
      </div>
    );
  }

  return (
    <div className="glass-card card-section">
      <div className="section-header">
        <h3 className="section-title">
          <Briefcase size={18} style={{ color: 'var(--accent-cyan)' }} />
          Experience
          <span className="badge-count">{experiences.length}</span>
        </h3>
      </div>

      <div className="timeline-list">
        {experiences.map((exp, index) => (
          <div key={index} className="timeline-item">
            <div className="timeline-icon">
              <Briefcase size={20} />
            </div>
            <div className="timeline-content">
              <div className="timeline-role">{exp.title || 'Role not specified'}</div>
              <div className="timeline-company">
                {exp.companyUrl ? (
                  <a
                    href={exp.companyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="link-btn"
                  >
                    {exp.company}
                  </a>
                ) : (
                  exp.company || 'Company not specified'
                )}
                {exp.employmentType && (
                  <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.85rem' }}>
                    {' '}• {exp.employmentType}
                  </span>
                )}
              </div>

              {(exp.startDate || exp.endDate || exp.location) && (
                <div className="timeline-duration">
                  {(exp.startDate || exp.endDate) && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginRight: '0.75rem' }}>
                      <Calendar size={13} />
                      {exp.startDate || 'Unknown'} — {exp.endDate || 'Present'}
                    </span>
                  )}
                  {exp.location && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      <MapPin size={13} />
                      {exp.location}
                    </span>
                  )}
                </div>
              )}

              {exp.description && (
                <p className="timeline-desc">{exp.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
