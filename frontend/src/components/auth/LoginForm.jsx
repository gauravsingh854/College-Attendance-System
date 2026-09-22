import React from 'react';
import Button from '../common/Button.jsx';
import { LogIn } from 'lucide-react';

export const LoginForm = ({ onSubmit, loading, error, formData, setFormData }) => {
  return (
    <form onSubmit={onSubmit}>
      {error && (
        <div
          style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: 'var(--accent-rose)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            marginBottom: '18px',
          }}
        >
          {error}
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Email</label>
        <input
          type="email"
          required
          className="form-input"
          placeholder="your.email@college.edu"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Password</label>
        <input
          type="password"
          required
          className="form-input"
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        loading={loading}
        icon={LogIn}
        style={{ width: '100%', marginTop: '8px' }}
      >
        Sign In
      </Button>
    </form>
  );
};

export default LoginForm;
