import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiCreditCard, FiTrendingUp, FiArrowRight, FiPhone, FiSmile, FiSmartphone } from 'react-icons/fi';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import API from '../api/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [stats, setStats] = useState({ totalRecharges: 0, totalSpent: 0, lastRecharge: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user?._id) {
        setLoading(false);
        return;
      }
      try {
        const response = await API.get(`/transactions/user/${user._id}`);
        const data = response.data;
        const totalSpent = data.reduce((sum, t) => sum + t.amount, 0);
        setRecentTransactions(data.slice(0, 5));
        setStats({
          totalRecharges: data.length,
          totalSpent,
          lastRecharge: data[0]?.createdAt || null,
        });
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [user]);

  const quickActions = [
    { icon: FiPhone, label: 'Mobile Recharge', to: '/recharge', color: 'blue' },
    { icon: FiClock, label: 'View History', to: '/history', color: 'green' },
    { icon: FiCreditCard, label: 'Browse Plans', to: '/recharge', color: 'purple' },
  ];

  return (
    <Layout>
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Welcome back, {user?.name}!
          </h1>
          
        </div>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Here's an overview of your account activity
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg">
              <FiSmartphone className="w-6 h-6" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Total</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {stats.totalRecharges}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Recharges Done</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
              <FiCreditCard className="w-6 h-6" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Spent</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            ₹{stats.totalSpent}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg">
              <FiClock className="w-6 h-6" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Recent</span>
          </div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
            {stats.lastRecharge ? new Date(stats.lastRecharge).toLocaleDateString() : 'No recharges'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Last Recharge</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.to}
              className="group bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:border-orange-500 dark:hover:border-orange-500 transition-all hover:shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg group-hover:scale-110 transition-transform">
                  <action.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                    {action.label}
                  </h3>
                </div>
                <FiArrowRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Recent Transactions
            </h2>
            <Link
              to="/history"
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
                    <p className="font-semibold text-green-600 dark:text-green-400">
                      ₹{transaction.amount}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 text-gray-400 rounded-full mb-4">
              <FiClock className="w-8 h-8" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-4">No transactions yet</p>
            <Link
              to="/recharge"
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <FiSmartphone className="w-4 h-4" />
              Make Your First Recharge
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
