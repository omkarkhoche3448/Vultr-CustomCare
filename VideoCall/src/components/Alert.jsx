// Alert.jsx
import React from 'react';
import './Alert.css';

export const Alert = ({ children, variant = 'default', className = '', ...props }) => {
  return (
    <div 
      className={`alert ${variant} ${className}`}
      role="alert" 
      {...props}
    >
      {children}
    </div>
  );
};

export const AlertDescription = ({ children, className = '', ...props }) => {
  return (
    <div className={`alert-description ${className}`} {...props}>
      {children}
    </div>
  );
};