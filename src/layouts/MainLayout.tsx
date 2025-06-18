import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const MainLayout: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                  IH Platform
                </h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/models"
                  className={`nav-link ${isActive('/models') ? 'nav-link-active' : ''}`}
                >
                  Models Catalog
                </Link>
                <Link
                  to="/blueprints"
                  className={`nav-link ${isActive('/blueprints') ? 'nav-link-active' : ''}`}
                >
                  Blueprints Catalog
                </Link>
                <Link
                  to="/gpu-cloud"
                  className={`nav-link ${isActive('/gpu-cloud') ? 'nav-link-active' : ''}`}
                >
                  GPU Cloud
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout; 