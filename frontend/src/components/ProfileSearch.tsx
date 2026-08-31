import React, { useState } from 'react';
import { Search, Loader2, Sparkles, AlertCircle } from 'lucide-react';

interface ProfileSearchProps {
  onSearch: (url: string) => void;
  loading: boolean;
  error: string | null;
}

const SAMPLE_PROFILES = [
  { label: 'Sample Profile', value: 'https://www.linkedin.com/in/manan-shukla-881686226' },
  { label: 'Satya Nadella', value: 'https://www.linkedin.com/in/satyanadella' },
  { label: 'Bill Gates', value: 'https://www.linkedin.com/in/williamhgates' },
];

export const ProfileSearch: React.FC<ProfileSearchProps> = ({ onSearch, loading, error }) => {
  const [inputUrl, setInputUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    onSearch(inputUrl.trim());
  };

  const handleSelectSample = (value: string) => {
    setInputUrl(value);
    onSearch(value);
  };

  return (
    <div className="glass-card hero-section">
      <h2 className="hero-title">
        Extract & Analyze <span>LinkedIn Profiles</span>
      </h2>
      <p className="hero-desc">
        Fetch rich structured profile information including work experiences, education history,
        verified skills, certifications, and extraction telemetry via the backend Dash API.
      </p>

      <form className="search-form" onSubmit={handleSubmit}>
        <div className="search-input-wrapper">
          <Search size={20} className="search-icon" />
          <input
            id="profile-url-input"
            type="text"
            className="search-input"
            placeholder="Enter LinkedIn profile URL (e.g. https://www.linkedin.com/in/username)..."
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            disabled={loading}
          />
          <button
            id="fetch-profile-button"
            type="submit"
            className="btn-primary"
            disabled={loading || !inputUrl.trim()}
          >
            {loading ? (
              <>
                <Loader2 size={17} className="spin-icon" />
                <span>Extracting...</span>
              </>
            ) : (
              <>
                <Sparkles size={17} />
                <span>Extract Data</span>
              </>
            )}
          </button>
        </div>

        <div className="quick-chips">
          <span className="quick-chip-label">Quick test:</span>
          {SAMPLE_PROFILES.map((sample) => (
            <button
              key={sample.value}
              type="button"
              className="quick-chip-btn"
              onClick={() => handleSelectSample(sample.value)}
              disabled={loading}
            >
              {sample.label}
            </button>
          ))}
        </div>
      </form>

      {error && (
        <div className="error-banner" style={{ marginTop: '1.5rem', textAlign: 'left' }}>
          <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--accent-rose)' }} />
          <div>
            <div className="error-title">Extraction Error</div>
            <div className="error-msg">{error}</div>
          </div>
        </div>
      )}
    </div>
  );
};
