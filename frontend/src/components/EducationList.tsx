import React from 'react';
import { GraduationCap, Calendar } from 'lucide-react';
import type { Education } from '../types/profile';

interface EducationListProps {
  education?: Education[];
}

export const EducationList: React.FC<EducationListProps> = ({ education = [] }) => {
  if (!education || education.length === 0) {
    return (
      <div className="glass-card card-section">
        <div className="section-header">
          <h3 className="section-title">
            <GraduationCap size={18} style={{ color: 'var(--accent-purple)' }} />
            Education
            <span className="badge-count">0</span>
          </h3>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No education records listed.</p>
      </div>
    );
  }

  return (
    <div className="glass-card card-section">
      <div className="section-header">
        <h3 className="section-title">
          <GraduationCap size={18} style={{ color: 'var(--accent-purple)' }} />
          Education
          <span className="badge-count">{education.length}</span>
        </h3>
      </div>

      <div className="timeline-list">
        {education.map((edu, index) => (
          <div key={index} className="timeline-item">
            <div
              className="timeline-icon"
              style={{ color: 'var(--accent-purple)', borderColor: 'rgba(168, 85, 247, 0.2)' }}
            >
              <GraduationCap size={20} />
            </div>
            <div className="timeline-content">
              <div className="timeline-role">{edu.institution || 'Institution not specified'}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500 }}>
                {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(', ') || 'Degree not specified'}
              </div>

              {(edu.startDate || edu.endDate) && (
                <div className="timeline-duration">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Calendar size={13} />
                    {edu.startDate || 'Unknown'} — {edu.endDate || 'Present'}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
