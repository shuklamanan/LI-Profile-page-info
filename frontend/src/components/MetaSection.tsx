import React from 'react';
import { Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { ResponseMeta } from '../types/profile';

interface MetaSectionProps {
  meta?: ResponseMeta | null;
}

export const MetaSection: React.FC<MetaSectionProps> = ({ meta }) => {
  if (!meta) return null;

  return (
    <div className="meta-box">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <span
          className={`meta-status-chip ${meta.partial ? 'partial' : 'complete'}`}
        >
          {meta.partial ? (
            <>
              <AlertTriangle size={14} /> Partial Extraction
            </>
          ) : (
            <>
              <CheckCircle2 size={14} /> Full Extraction
            </>
          )}
        </span>

        {meta.missingSections && meta.missingSections.length > 0 && (
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            Missing sections: {meta.missingSections.join(', ')}
          </span>
        )}
      </div>

      {meta.retrievedAt && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          <Clock size={13} />
          Retrieved at: {new Date(meta.retrievedAt).toLocaleString()}
        </div>
      )}
    </div>
  );
};
