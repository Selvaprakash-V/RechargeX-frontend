import { useState } from 'react';
import { FiMenu } from 'react-icons/fi';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children, showSidebar = true, showFooter = true }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isLoggedIn } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-black">
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar - only show when logged in and showSidebar is true */}
        {isLoggedIn && showSidebar && (
          <>
            {/* Mobile sidebar toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden fixed bottom-4 right-4 z-30 p-3 bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 transition-colors"
            >
              <FiMenu className="w-6 h-6" />
            </button>

            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>

      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;
