import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  className = '',
  loading = false,
  icon: Icon,
  ...props
}) => {
  return (
    <button
      className={`btn btn-${variant} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span>Loading...</span>
      ) : (
        <>
          {Icon && <Icon size={18} />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
