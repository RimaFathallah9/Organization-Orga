import React, { useState } from 'react';
import styles from './Navbar.module.css';

interface NavbarProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, onLogout }) => {
  const [activeLink, setActiveLink] = React.useState('dashboard');
  const [showMenu, setShowMenu] = useState(false);

  const handleNavClick = (page: string) => {
    setActiveLink(page);
    onNavigate?.(page);
  };

  const handleLogout = () => {
    setShowMenu(false);
    onLogout?.();
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>🎯</div>
          <div className={styles.logoText}>
            <div className={styles.logoMain}>Impact Ledger</div>
            <div className={styles.logoSub}>Skill Validation</div>
          </div>
        </div>

        <div className={styles.navLinks}>
          <button
            className={`${styles.navLink} ${activeLink === 'dashboard' ? styles.active : ''}`}
            onClick={() => handleNavClick('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`${styles.navLink} ${activeLink === 'marketplace' ? styles.active : ''}`}
            onClick={() => handleNavClick('marketplace')}
          >
            Marketplace
          </button>
          <button
            className={`${styles.navLink} ${activeLink === 'evaluation' ? styles.active : ''}`}
            onClick={() => handleNavClick('evaluation')}
          >
            Evaluation
          </button>
        </div>

        <div className={styles.userSection}>
          <div className={styles.profileMenu}>
            <button 
              className={styles.profileBtn}
              onClick={() => setShowMenu(!showMenu)}
            >
              <div className={styles.avatar}>👤</div>
            </button>
            {showMenu && (
              <div className={styles.dropdown}>
                <button className={styles.dropdownItem}>Profile</button>
                <button className={styles.dropdownItem}>Settings</button>
                <button className={styles.dropdownItem} onClick={handleLogout}>
                  Logout 🚪
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
