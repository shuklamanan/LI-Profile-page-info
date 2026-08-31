import React, { useEffect, useState } from 'react';
import { RefreshCw, Layers } from 'lucide-react';
import { checkHealth } from '../services/api';
import type { HealthCheckResult } from '../services/api';

export const Header: React.FC = () => {
  const [health, setHealth] = useState<HealthCheckResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchHealth = async () => {
    setLoading(true);
    const result = await checkHealth();
    setHealth(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchHealth();
    // Poll health status every 30 seconds
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="header-wrapper">
      <div className="header-container">
        <div className="brand-section">
          <div className="brand-logo">
            <Layers size={22} />
          </div>
          <div>
            <h1 className="brand-title">LinkedIn Profile Intelligence</h1>
            <p className="brand-subtitle">Voyager Dash Engine & API Explorer</p>
          </div>
        </div>

        <button
          id="health-check-button"
          className="health-chip"
          onClick={fetchHealth}
          title="Click to re-ping Backend Health API"
        >
          <span
            className={`health-dot ${
              loading ? 'loading' : health?.isHealthy ? 'online' : 'offline'
            }`}
          />
          <span>
            {loading
              ? 'Checking backend...'
              : health?.isHealthy
              ? `API Online (${health.latencyMs}ms)`
              : 'API Offline'}
          </span>
          <RefreshCw size={13} className={loading ? 'spin-icon' : ''} style={{ color: 'var(--text-muted)' }} />
        </button>
      </div>
    </header>
  );
};
