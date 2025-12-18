import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiLoader } from 'react-icons/fi';
import API from '../api/api';
import PlanCard from '../components/PlanCard';
import ThemeToggle from '../components/ThemeToggle';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await API.get('/plans');
      setPlans(response.data);
      setFilteredPlans(response.data);
    } catch (err) {
      setError('Failed to load plans. Please try again later.');
      console.error('Error fetching plans:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProvider === 'all') {
      setFilteredPlans(plans);
    } else {
      setFilteredPlans(plans.filter(plan => plan.provider?.toLowerCase() === selectedProvider.toLowerCase()));
    }
  }, [selectedProvider, plans]);

  const providers = ['all', ...new Set(plans.map(plan => plan.provider).filter(Boolean))];

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
              >
                <FiArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </Link>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">RX</span>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  Recharge<span className="text-orange-500">X</span>
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link 
                to="/login" 
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 font-medium transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-orange-500/25"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Perfect 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600"> Plan</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Discover our range of mobile recharge plans with exclusive benefits, 
            instant activation, and unbeatable value for money.
          </p>
        </div>

        {error ? (
          <div className="text-center py-12">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <button 
                onClick={fetchPlans}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No plans available at the moment.</p>
          </div>
        ) : (
          <>
            {/* Provider Filter Buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              {providers.map((provider) => (
                <button
                  key={provider}
                  onClick={() => setSelectedProvider(provider)}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-all capitalize ${
                    selectedProvider === provider
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                      : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500'
                  }`}
                >
                  {provider === 'all' ? 'All Providers' : provider}
                </button>
              ))}
            </div>

            {filteredPlans.length === 0 ? (
              <div className="text-center py-12 col-span-full">
                <p className="text-gray-500 dark:text-gray-400 text-lg">No plans found for {selectedProvider}.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {filteredPlans.map((plan) => (
                  <PlanCard
                    key={plan._id}
                    plan={plan}
                    showDetails={true}
                    className="hover:scale-105 transition-transform"
                  />
                ))}
              </div>
            )}

            {/* Call to Action */}
            <div className="text-center bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                Sign up now to enjoy instant recharges, exclusive cashback offers, 
                and seamless mobile plan management.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/signup" 
                  className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-orange-500/30"
                >
                  Create Account
                </Link>
                <Link 
                  to="/login" 
                  className="px-8 py-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 rounded-xl font-semibold hover:border-orange-500 dark:hover:border-orange-500 transition-all"
                >
                  Login to Recharge
                </Link>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Plans;