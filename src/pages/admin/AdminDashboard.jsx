import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiCreditCard, FiTrendingUp, FiArrowRight, FiActivity, FiPhone } from 'react-icons/fi';
import Layout from '../../components/Layout';
import API from '../../api/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalPlans: 0, totalTransactions: 0, totalRevenue: 0 });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, plansRes, transactionsRes] = await Promise.all([
          API.get('/users'),
          API.get('/plans'),
          API.get('/transactions'),
        ]);
        
        const users = usersRes.data;
        const plans = plansRes.data;
        const transactions = transactionsRes.data;
        
        const totalRevenue = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
        
        setStats({
          totalUsers: users.length,
          totalPlans: plans.length,
          totalTransactions: transactions.length,
          totalRevenue,
        });
        setRecentTransactions(transactions.slice(0, 5));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { icon: FiUsers, label: 'Total Users', value: stats.totalUsers, color: 'orange', to: '/admin/users' },
    { icon: FiCreditCard, label: 'Active Plans', value: stats.totalPlans, color: 'green', to: '/admin/plans' },
    { icon: FiActivity, label: 'Transactions', value: stats.totalTransactions, color: 'orange', to: '/admin/transactions' },
    { icon: FiTrendingUp, label: 'Total Revenue', value: `₹${stats.totalRevenue}`, color: 'amber', to: '/admin/transactions' },
  ];

  const quickActions = [
    { label: 'Manage Plans', to: '/admin/plans', icon: FiCreditCard },
    { label: 'View Users', to: '/admin/users', icon: FiUsers },
    { label: 'Transactions', to: '/admin/transactions', icon: FiActivity },
  ];

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Welcome back! Here's an overview of your platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            to={stat.to}
            className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all hover:border-orange-300 dark:hover:border-orange-600"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${
                stat.color === 'orange' ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' :
                stat.color === 'green' ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
              }`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <FiArrowRight className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {stat.value}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.to}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors group"
              >
                <action.icon className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400">{action.label}</span>
                <FiArrowRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-orange-500" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Recent Transactions
              </h2>
              <Link
                to="/admin/transactions"
                className="text-orange-600 dark:text-orange-400 text-sm font-medium hover:underline flex items-center gap-1"
              >
                View All
                <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {recentTransactions.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {recentTransactions.map((transaction) => (
                <div key={transaction._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg">
                        <FiPhone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-100">
                          {transaction.mobileNumber}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {transaction.provider} • {transaction.planId?.planName}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600 dark:text-green-400">₹{transaction.amount}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <FiActivity className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No transactions yet</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
