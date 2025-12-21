import React from 'react';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

const Loading: React.FC<LoadingProps> = ({ size = 'medium', text = 'Loading...' }) => {
  const sizeMap = {
    small: '24px',
    medium: '40px',
    large: '60px',
  };

  const spinnerSize = sizeMap[size];

  return (
    <div style={styles.container}>
      <div style={{ ...styles.spinner, width: spinnerSize, height: spinnerSize }} />
      {text && <p style={styles.text}>{text}</p>}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  spinner: {
    border: '4px solid rgba(0, 0, 0, 0.1)',
    borderTop: '4px solid #3498db',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  text: {
    marginTop: '16px',
    fontSize: '14px',
    color: '#666',
  },
};

export default Loading;
