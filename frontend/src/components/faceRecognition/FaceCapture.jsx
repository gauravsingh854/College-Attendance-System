import React from 'react';
import { ScanFace } from 'lucide-react';

export const FaceCapture = ({ onCapture, disabled }) => {
  return (
    <div
      style={{
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: '24px',
        textAlign: 'center',
        background: 'rgba(15, 23, 42, 0.4)',
      }}
    >
      <ScanFace size={48} color="var(--accent-cyan)" style={{ marginBottom: '12px' }} />
      <h4 style={{ marginBottom: '6px' }}>Biometric Mesh Capture</h4>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
        Extracts 128-d floating point facial vectors
      </p>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={onCapture}
        disabled={disabled}
      >
        Capture Embedding
      </button>
    </div>
  );
};

export default FaceCapture;
