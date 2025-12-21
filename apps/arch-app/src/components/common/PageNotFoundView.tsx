import React from 'react';
import { useNavigate } from 'react-router-dom';

const PageNotFoundView: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.errorCode}>404</h1>
        <h2 style={styles.title}>Page Not Found</h2>
        <p style={styles.message}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <button type="button" onClick={handleGoHome} style={styles.button}>
          Go to Home
        </button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  content: {
    textAlign: 'center',
    padding: '40px',
  },
  errorCode: {
    fontSize: '120px',
    fontWeight: 'bold',
    color: '#3498db',
    margin: '0',
    lineHeight: '1',
  },
  title: {
    fontSize: '32px',
    fontWeight: '600',
    color: '#333',
    margin: '20px 0',
  },
  message: {
    fontSize: '16px',
    color: '#666',
    maxWidth: '500px',
    margin: '0 auto 30px',
    lineHeight: '1.6',
  },
  button: {
    padding: '12px 30px',
    fontSize: '16px',
    fontWeight: '500',
    color: '#fff',
    backgroundColor: '#3498db',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default PageNotFoundView;
