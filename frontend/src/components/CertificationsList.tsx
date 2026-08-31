import React from 'react';
import { ShieldCheck, Calendar, Hash } from 'lucide-react';
import type { Certification } from '../types/profile';

interface CertificationsListProps {
  certifications?: Certification[];
}

export const CertificationsList: React.FC<CertificationsListProps> = ({ certifications = [] }) => {
  if (!certifications || certifications.length === 0) {
    return null;
  }

  return (
    <div className="glass-card card-section">
      <div className="section-header">
        <h3 className="section-title">
          <ShieldCheck size={18} style={{ color: 'var(--accent-emerald)' }} />
          Certifications & Licenses
          <span className="badge-count">{certifications.length}</span>
        </h3>
      </div>

      <div className="two-col-grid">
        {certifications.map((cert, index) => (
          <div key={index} className="cert-card">
            <div className="cert-name">{cert.name || 'Certification'}</div>
            {cert.issuer && <div className="cert-issuer">{cert.issuer}</div>}
            {(cert.issueDate || cert.expirationDate) && (
              <div className="cert-date">
                <Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} />
                Issued {cert.issueDate || 'N/A'} {cert.expirationDate ? `• Expires ${cert.expirationDate}` : ''}
              </div>
            )}
            {cert.credentialId && (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                <Hash size={11} style={{ display: 'inline', marginRight: '3px' }} />
                ID: {cert.credentialId}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
