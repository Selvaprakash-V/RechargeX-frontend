import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import { FiShield, FiBarChart2, FiMessageCircle, FiSmartphone, FiTv, FiFileText, FiWifi, FiStar, FiUsers, FiClock, FiAward, FiTrendingUp } from 'react-icons/fi';

// Import reviewer images only
import img1 from '../assets/img1.jpg';
import img2 from '../assets/img2.jpg';
import img3 from '../assets/img3.jpg';

// Online images for landing page
const heroImage = 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80';
const showcaseImg1 = 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&q=80';
const showcaseImg2 = 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80';

const LandingPage = () => {
  const { darkMode } = useTheme();
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch('http://localhost:3000/feedbacks/approved');
        const data = await response.json();
        setTestimonials(data.length > 0 ? data : defaultTestimonials);
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
        setTestimonials(defaultTestimonials);
      }
    };
    fetchFeedbacks();
  }, []);

  const features = [
    {
      title: 'Fast Recharges',
      description: 'Instant recharges for all major operators with real-time confirmation',
      icon: FiTrendingUp
    },
    {
      title: 'Secure Payments',
      description: 'Bank-grade security with encrypted transactions and data protection',
      icon: FiShield
    },
    {
      title: 'Best Plans',
      description: 'Compare and choose from the best plans across all operators',
      icon: FiBarChart2
    },
    {
      title: '24/7 Support',
      description: 'Round-the-clock customer support for all your queries',
      icon: FiMessageCircle
    }
  ];

  const services = [
    { name: 'Mobile Recharge', icon: FiSmartphone },
    { name: 'DTH Recharge', icon: FiTv },
    { name: 'Bill Payments', icon: FiFileText },
    { name: 'Data Packs', icon: FiWifi }
  ];

  const defaultTestimonials = [
    {
      name: 'Mahendra Singh Dhoni',
      feedback: 'RechargeX has made my life so much easier. Quick and reliable!',
      rating: 5,
      image: img1
    },
    {
      name: 'Rohit Sharma',
      feedback: 'Best recharge platform with amazing offers and cashback.',
      rating: 5,
      image: img2
    },
    {
      name: 'Virat Kohli',
      feedback: 'Simple interface and fast transactions. Highly recommended!',
      rating: 4,
      image: img3
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300">
        
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">RX</span>
                </div>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  Recharge<span className="text-orange-500">X</span>
                </span>
              </div>
              
              <nav className="hidden md:flex items-center space-x-8">
                <a href="#features" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">Features</a>
                <a href="#services" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">Services</a>
                <a href="#testimonials" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">Reviews</a>
              </nav>
              
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

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 via-white to-gray-50 dark:from-gray-950 dark:via-black dark:to-gray-950">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center px-4 py-2 bg-orange-100 dark:bg-orange-900/30 rounded-full mb-6">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></span>
                  <span className="text-sm font-medium text-orange-700 dark:text-orange-400">Trusted by 1M+ Users</span>
                </div>
                
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                  Recharge Smarter,
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">Save More</span>
                </h1>
                
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Experience lightning-fast mobile recharges, DTH payments, and bill settlements 
                  with exclusive cashback offers and rewards.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link 
                    to="/signup" 
                    className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold text-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-xl hover:shadow-orange-500/30 hover:scale-105"
                  >
                    Get Started Free
                  </Link>
                  <Link 
                    to="/plans" 
                    className="px-8 py-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 rounded-xl font-semibold text-lg hover:border-orange-500 dark:hover:border-orange-500 transition-all hover:scale-105"
                  >
                    Explore Plans
                  </Link>
                </div>
              </div>

              {/* Right - Hero Image/Illustration */}
              <div className="relative hidden lg:block">
                <div className="relative">
                  {/* Main Image Container */}
                  <div className="relative z-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-1 shadow-2xl shadow-orange-500/20">
                    <div className="bg-white dark:bg-gray-900 rounded-[22px] p-6">
                      <img 
                        src={heroImage} 
                        alt="Happy customer using RechargeX" 
                        className="w-full h-80 object-cover rounded-xl"
                      />
                      {/* Floating Card 1 */}
                      <div className="absolute -left-8 top-1/4 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                            <FiTrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">Instant Recharge</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Under 5 seconds</p>
                          </div>
                        </div>
                      </div>
                      {/* Floating Card 2 */}
                      <div className="absolute -right-8 bottom-1/4 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                            <FiAward className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">Cashback</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Up to 10% rewards</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Background Decorations */}
                  <div className="absolute -top-4 -right-4 w-72 h-72 bg-orange-200 dark:bg-orange-900/20 rounded-full blur-3xl opacity-60"></div>
                  <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-orange-300 dark:bg-orange-800/20 rounded-full blur-3xl opacity-40"></div>
                </div>
              </div>
            </div>
              
            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: '1M+', label: 'Active Users', icon: FiUsers },
                { value: '50M+', label: 'Transactions', icon: FiTrendingUp },
                { value: '99.9%', label: 'Uptime', icon: FiClock },
                { value: '4.8', label: 'App Rating', icon: FiStar }
              ].map((stat, idx) => {
                const IconComponent = stat.icon;
                return (
                  <div key={idx} className="text-center p-4 bg-white/50 dark:bg-gray-900/50 rounded-2xl backdrop-blur-sm">
                    <div className="flex justify-center mb-2">
                      <IconComponent className="w-6 h-6 text-orange-500" />
                    </div>
                    <div className="text-3xl sm:text-4xl font-bold text-orange-500">{stat.value}</div>
                    <div className="text-gray-600 dark:text-gray-400 mt-1">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Why Choose <span className="text-orange-500">RechargeX</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Experience the next generation of mobile recharge with features designed for your convenience
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, idx) => {
                const IconComponent = feature.icon;
                return (
                  <div 
                    key={idx}
                    className="group p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-orange-500 dark:hover:border-orange-500 transition-all hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1"
                  >
                    <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <IconComponent className="w-7 h-7 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Our Services
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                One platform for all your recharge and bill payment needs
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {services.map((service, idx) => {
                const IconComponent = service.icon;
                return (
                  <div 
                    key={idx}
                    className="group p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-orange-500 dark:hover:border-orange-500 transition-all hover:shadow-xl cursor-pointer text-center"
                  >
                    <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <IconComponent className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{service.name}</h3>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* App Showcase Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left - Images Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden shadow-xl">
                    <img 
                      src={showcaseImg1} 
                      alt="User experience" 
                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-white">
                    <FiShield className="w-10 h-10 mb-3" />
                    <h4 className="font-bold text-lg">100% Secure</h4>
                    <p className="text-orange-100 text-sm">Bank-grade encryption</p>
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="rounded-2xl overflow-hidden shadow-xl bg-gray-900 dark:bg-gray-800 p-6 text-white">
                    <FiTrendingUp className="w-10 h-10 mb-3 text-orange-400" />
                    <h4 className="font-bold text-lg">Lightning Fast</h4>
                    <p className="text-gray-400 text-sm">Recharge in seconds</p>
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-xl">
                    <img 
                      src={showcaseImg2} 
                      alt="Mobile recharge" 
                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              </div>

              {/* Right - Content */}
              <div className="lg:pl-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Recharge Anytime,
                  <br />
                  <span className="text-orange-500">Anywhere</span>
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg leading-relaxed">
                  Whether you're at home or on the go, RechargeX makes it simple to keep your mobile 
                  topped up. With our intuitive interface and lightning-fast processing, you'll never 
                  run out of balance again.
                </p>
                <ul className="space-y-4">
                  {[
                    { icon: FiSmartphone, text: 'All major operators supported' },
                    { icon: FiShield, text: 'Secure payment gateway' },
                    { icon: FiClock, text: '24/7 instant recharges' },
                    { icon: FiAward, text: 'Exclusive cashback offers' }
                  ].map((item, idx) => {
                    const IconComponent = item.icon;
                    return (
                      <li key={idx} className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{item.text}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                What Our Users Say
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Join thousands of satisfied customers who trust RechargeX
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.slice(0, 6).map((testimonial, idx) => (
                <div 
                  key={testimonial._id || idx}
                  className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-orange-500 dark:hover:border-orange-500 transition-all"
                >
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <FiStar 
                        key={i} 
                        className={`w-5 h-5 ${i < testimonial.rating ? 'text-orange-400 fill-orange-400' : 'text-gray-300 dark:text-gray-700'}`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 italic">"{testimonial.feedback}"</p>
                  <div className="flex items-center">
                    {(testimonial.profilePhoto || testimonial.image) ? (
                      <img 
                        src={testimonial.profilePhoto || testimonial.image} 
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover mr-3 border-2 border-orange-200 dark:border-orange-800"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '';
                          e.target.style.display = 'none';
                          const fallback = e.target.parentElement.querySelector('.fallback-avatar');
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className="fallback-avatar w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 flex items-center justify-center mr-3 border-2 border-orange-200 dark:border-orange-800"
                      style={{ display: (testimonial.profilePhoto || testimonial.image) ? 'none' : 'flex' }}
                    >
                      <span className="text-orange-600 dark:text-orange-400 font-bold text-lg">
                        {testimonial.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-500 to-orange-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Start Saving?
            </h2>
            <p className="text-orange-100 text-lg mb-8 max-w-2xl mx-auto">
              Join millions of users who save time and money with RechargeX. 
              Sign up now and get exclusive offers on your first recharge!
            </p>
            <Link 
              to="/signup" 
              className="inline-block px-8 py-4 bg-white text-orange-600 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
            >
              Create Free Account
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 dark:bg-black text-gray-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">RX</span>
                </div>
                <span className="text-xl font-bold text-white">
                  Recharge<span className="text-orange-500">X</span>
                </span>
              </div>
              
              <div className="flex items-center space-x-6">
                <a href="#" className="hover:text-orange-400 transition-colors">Privacy</a>
                <a href="#" className="hover:text-orange-400 transition-colors">Terms</a>
                <a href="#" className="hover:text-orange-400 transition-colors">Contact</a>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
              <p>&copy; 2024 RechargeX. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
