import React, { useState } from 'react';
import { Award } from 'lucide-react';

interface SkillsCloudProps {
  skills?: string[];
}

export const SkillsCloud: React.FC<SkillsCloudProps> = ({ skills = [] }) => {
  const [filter, setFilter] = useState('');

  const filteredSkills = skills.filter((skill) =>
    skill.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="glass-card card-section">
      <div className="section-header">
        <h3 className="section-title">
          <Award size={18} style={{ color: 'var(--accent-amber)' }} />
          Skills & Endorsements
          <span className="badge-count">{skills.length}</span>
        </h3>
      </div>

      {skills.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No skills listed.</p>
      ) : (
        <div className="skills-wrapper">
          {skills.length > 6 && (
            <div style={{ position: 'relative' }}>
              <input
                id="skills-search-filter"
                type="text"
                className="skills-filter-input"
                placeholder="Filter skills..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
          )}

          <div className="skills-cloud">
            {filteredSkills.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No matching skills found.</p>
            ) : (
              filteredSkills.map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                </span>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
