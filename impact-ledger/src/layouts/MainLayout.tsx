import React from 'react';
import { Navbar } from '../components/Navbar';
import styles from './MainLayout.module.css';

interface MainLayoutProps {
  children: React.ReactNode;
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, onNavigate, onLogout }) => {
  return (
    <div className={styles.layout}>
      <Navbar onNavigate={onNavigate} onLogout={onLogout} />
      <main className={styles.main}>
        <div className={styles.container}>{children}</div>
      </main>
    </div>
  );
};
