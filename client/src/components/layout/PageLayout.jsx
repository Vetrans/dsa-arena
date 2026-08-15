import React, { useEffect } from 'react';
import { Navbar } from './Navbar';
import { MobileNav } from './MobileNav';
import { Footer } from './Footer';
import { useAuthStore } from '../../store/authStore';
import './PageLayout.css';

export const PageLayout = ({ children }) => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="page-layout">
      <Navbar />
      <MobileNav />
      <main className="page-main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PageLayout;
