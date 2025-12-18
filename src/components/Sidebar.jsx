import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, FiClock, FiUser, FiSettings, FiUsers, 
  FiCreditCard, FiPieChart, FiShield, FiX, FiSmartphone 
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose, className = '' }) => {
  const { userRole } = useAuth();
  const location = useLocation();

  const userLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: FiHome },
    { to: '/recharge', label: 'Recharge', icon: FiSmartphone },
    { to: '/history', label: 'History', icon: FiClock },
    { to: '/profile', label: 'Profile', icon: FiUser },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: FiPieChart },
    { to: '/admin/plans', label: 'Manage Plans', icon: FiCreditCard },
    { to: '/admin/users', label: 'Manage Users', icon: FiUsers },
    { to: '/admin/transactions', label: 'Transactions', icon: FiClock },
  ];

  const links = userRole === 'admin' ? adminLinks : userLinks;
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64
          bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800
          transform transition-transform duration-200 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${className}
        `}
      >
        <div className="h-full flex flex-col">
          {/* Mobile Close Button */}
          <div className="lg:hidden flex justify-end p-4">
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                  transition-colors duration-200
                  ${isActive(link.to)
                    ? 'bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Role Badge */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <div className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
              ${userRole === 'admin'
                ? 'bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400'
                : 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400'
              }
            `}>
              <FiShield className="w-4 h-4" />
              {userRole === 'admin' ? 'Administrator' : 'User Account'}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
