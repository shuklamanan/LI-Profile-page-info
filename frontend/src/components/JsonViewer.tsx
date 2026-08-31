import React, { useState } from 'react';
import { Copy, Check, Download, Terminal } from 'lucide-react';
import type { ProfileResponse } from '../types/profile';

interface JsonViewerProps {
  data: ProfileResponse;
}

export const JsonViewer: React.FC<JsonViewerProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);
  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback if clipboard API fails
      const textarea = document.createElement('textarea');
      textarea.value = jsonString;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `linkedin-profile-${data.data?.id || 'export'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="json-viewer-container">
      <div className="json-viewer-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          <Terminal size={16} />
          <span>Raw API Response Payload</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            id="copy-json-btn"
            className="quick-chip-btn"
            onClick={handleCopy}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            {copied ? <Check size={14} style={{ color: 'var(--accent-emerald)' }} /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
          </button>
          <button
            id="download-json-btn"
            className="quick-chip-btn"
            onClick={handleDownload}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Download size={14} />
            <span>Download</span>
          </button>
        </div>
      </div>
      <pre className="json-pre">{jsonString}</pre>
    </div>
  );
};
