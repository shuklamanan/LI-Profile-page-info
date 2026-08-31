import React, { useState } from 'react';
import { Header } from './components/Header';
import { ProfileSearch } from './components/ProfileSearch';
import { ProfileView } from './components/ProfileView';
import { fetchProfile } from './services/api';
import type { ProfileResponse } from './types/profile';
import { Search } from 'lucide-react';

export const App: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchProfile(url);
      setProfileData(response);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch LinkedIn profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-layout">
      <Header />

      <main className="main-content">
        <ProfileSearch onSearch={handleSearch} loading={loading} error={error} />

        {loading && (
          <div className="glass-card card-section" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="skeleton" style={{ width: '80px', height: '80px', borderRadius: '50%' }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div className="skeleton" style={{ width: '40%', height: '24px' }} />
                <div className="skeleton" style={{ width: '70%', height: '16px' }} />
                <div className="skeleton" style={{ width: '30%', height: '14px' }} />
              </div>
            </div>
            <div className="skeleton" style={{ width: '100%', height: '100px', marginTop: '1rem' }} />
            <div className="skeleton" style={{ width: '100%', height: '150px' }} />
          </div>
        )}

        {!loading && profileData && (
          <ProfileView response={profileData} />
        )}

        {!loading && !profileData && !error && (
          <div
            className="glass-card card-section"
            style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: 'var(--text-muted)' }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                color: 'var(--accent-cyan)',
              }}
            >
              <Search size={24} />
            </div>
            <h3 style={{ color: 'var(--text-primary)', fontSize: '1.15rem', marginBottom: '0.35rem' }}>
              No Profile Loaded Yet
            </h3>
            <p style={{ maxWidth: '450px', margin: '0 auto', fontSize: '0.9rem' }}>
              Enter a LinkedIn public profile URL above or select a sample profile to fetch and inspect structured career data.
            </p>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>LinkedIn Profile Intelligence Dashboard • Powered by Express & React TypeScript</p>
      </footer>
    </div>
  );
};

export default App;
