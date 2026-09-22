import React, { useState } from 'react';
import { Camera, RefreshCw } from 'lucide-react';

export const QrScanner = ({ onScanSuccess }) => {
  const [scanning, setScanning] = useState(false);

  return (
    <div
      style={{
        border: '2px dashed var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: '32px',
        textAlign: 'center',
        background: 'rgba(15, 23, 42, 0.5)',
      }}
    >
      <Camera size={40} color="var(--accent-primary)" style={{ marginBottom: '12px' }} />
      <h4 style={{ marginBottom: '6px' }}>Interactive Camera Scanner</h4>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
        Point at projected classroom rotating QR code
      </p>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => setScanning(!scanning)}
      >
        <RefreshCw size={16} />
        {scanning ? 'Stop Scanning' : 'Activate Camera'}
      </button>
    </div>
  );
};

export default QrScanner;
