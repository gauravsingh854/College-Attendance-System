import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = 'var(--accent-primary)' }) => {
  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
          {title}
        </span>
        {Icon && (
          <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.05)' }}>
            <Icon size={20} color={color} />
          </div>
        )}
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 800 }}>{value}</div>
      {subtitle && (
        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '6px' }}>
          {subtitle}
        </div>
      )}
    </div>
  );
};

export default StatCard;
