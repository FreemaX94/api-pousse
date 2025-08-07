import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../shared/components/NavBar';
import TestNavBar from '../TestNavBar';
import GlobalThemeSelector from '../components/GlobalThemeSelector';

const MainLayout = () => {
  return (
    <div className="min-h-screen">
      <GlobalThemeSelector />
      <TestNavBar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;