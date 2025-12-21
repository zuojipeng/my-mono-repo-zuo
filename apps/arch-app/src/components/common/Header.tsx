import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  rightContent?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  title = 'My App',
  showBackButton = false,
  rightContent,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <div style={styles.left}>
          {showBackButton && (
            <button type="button" onClick={handleBack} style={styles.backButton}>
              ← Back
            </button>
          )}
        </div>

        <div style={styles.center}>
          <Link to="/" style={styles.titleLink}>
            <h1 style={styles.title}>{title}</h1>
          </Link>
        </div>

        <div style={styles.right}>{rightContent}</div>
      </div>
    </header>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '16px 24px',
  },
  left: {
    flex: '0 0 auto',
    minWidth: '100px',
  },
  center: {
    flex: '1 1 auto',
    textAlign: 'center',
  },
  right: {
    flex: '0 0 auto',
    minWidth: '100px',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  titleLink: {
    textDecoration: 'none',
    color: 'inherit',
  },
  title: {
    margin: 0,
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
  },
  backButton: {
    padding: '8px 16px',
    fontSize: '14px',
    color: '#3498db',
    backgroundColor: 'transparent',
    border: '1px solid #3498db',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
};

export default Header;
