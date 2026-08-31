import React from 'react';
import { Globe } from 'lucide-react';
import type { Language } from '../types/profile';

interface LanguagesListProps {
  languages?: Language[];
}

export const LanguagesList: React.FC<LanguagesListProps> = ({ languages = [] }) => {
  if (!languages || languages.length === 0) {
    return null;
  }

  return (
    <div className="glass-card card-section">
      <div className="section-header">
        <h3 className="section-title">
          <Globe size={18} style={{ color: 'var(--accent-cyan)' }} />
          Languages
          <span className="badge-count">{languages.length}</span>
        </h3>
      </div>

      <div className="two-col-grid">
        {languages.map((lang, index) => (
          <div key={index} className="lang-card">
            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{lang.name || 'Language'}</div>
            {lang.proficiency && (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {lang.proficiency}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
