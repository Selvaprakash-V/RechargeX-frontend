import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { FiPhone, FiSearch, FiCheck, FiX, FiSmartphone } from 'react-icons/fi';
import Layout from '../components/Layout';
import InputField from '../components/InputField';
import Button from '../components/Button';
import PlanCard from '../components/PlanCard';
import { useAuth } from '../context/AuthContext';
import API from '../api/api';

const operators = ['Airtel', 'Jio', 'Vi', 'BSNL'];

const schema = yup.object({
  phone: yup.string().matches(/^[0-9]{10}$/, 'Phone must be 10 digits').required('Phone is required'),
  operator: yup.string().required('Select an operator'),
}).required();

const DetailRow = ({ label, value, highlight }) => (
  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800 last:border-0">
    <span className="text-gray-500">{label}</span>
    <span className={highlight ? 'font-bold text-xl text-green-600' : 'font-medium text-gray-900 dark:text-white'}>{value}</span>
  </div>
);

const Recharge = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [showPlans, setShowPlans] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [rechargeComplete, setRechargeComplete] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const formValues = watch();

  useEffect(() => {
    API.get('/plans')
      .then(res => setPlans(res.data))
      .catch(() => setPlans([]))
      .finally(() => setLoadingPlans(false));
  }, []);

  const filteredPlans = plans.filter(plan => {
    const matchesSearch = !searchTerm ||
      plan.planName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.price?.toString().includes(searchTerm) ||
      plan.addOns?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProvider = !formValues.operator || 
      plan.provider?.toLowerCase() === formValues.operator?.toLowerCase();
    
    return matchesSearch && matchesProvider;
  });

  const handleRecharge = async () => {
    if (!selectedPlan) return;
    setLoading(true);
    setShowConfirmation(false);

    try {
      await API.post('/transactions', {
        userId: user?._id,
        mobileNumber: formValues.phone,
        provider: formValues.operator,
        planId: selectedPlan._id,
        amount: selectedPlan.price,
        paymentMethod: 'UPI',
        status: 'SUCCESS',
      });

      setLoading(false);
      setRechargeComplete(true);
    } catch (error) {
      console.error('Recharge error:', error);
      setLoading(false);
      alert('Recharge failed. Please try again.');
    }
  };

  const resetRecharge = () => { setRechargeComplete(false); setShowPlans(false); setSelectedPlan(null); };

  if (rechargeComplete) {
    return (
      <Layout>
        <div className="max-w-md mx-auto text-center py-12">
          <div className="bg-green-100 dark:bg-green-900/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheck className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Recharge Successful!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">₹{selectedPlan?.price} recharge for {formValues.phone} processed.</p>
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 mb-6 text-left space-y-2">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Transaction Details</h3>
            <DetailRow label="Mobile" value={formValues.phone} />
            <DetailRow label="Operator" value={formValues.operator} />
            <DetailRow label="Plan" value={selectedPlan?.planName} />
            <DetailRow label="Validity" value={selectedPlan?.validity} />
            <DetailRow label="Data" value={selectedPlan?.data} />
            <DetailRow label="Amount" value={`₹${selectedPlan?.price}`} highlight />
          </div>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate('/history')}>View History</Button>
            <Button variant="outline" onClick={resetRecharge}>New Recharge</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Mobile Recharge</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Instant prepaid mobile recharge with best plans</p>

        {!showPlans && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm mb-8">
            <form onSubmit={handleSubmit(() => setShowPlans(true))} className="space-y-6">
              <InputField label="Mobile Number" type="tel" placeholder="Enter 10-digit mobile number" icon={FiPhone} error={errors.phone?.message} {...register('phone')} />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Operator</label>
                <select {...register('operator')} className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-2.5 focus:ring-2 focus:ring-orange-500">
                  <option value="">Select Operator</option>
                  {operators.map(op => <option key={op} value={op}>{op}</option>)}
                </select>
                {errors.operator && <p className="mt-1 text-sm text-red-500">{errors.operator.message}</p>}
              </div>
              <Button type="submit" className="w-full" size="lg"><FiSmartphone className="w-5 h-5 mr-2" />View Plans</Button>
            </form>
          </div>
        )}

        {showPlans && (
          <>
            <div className="flex items-center gap-4 mb-6">
              <Button variant="ghost" onClick={() => setShowPlans(false)}>← Back</Button>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Plans for {formValues.phone} ({formValues.operator})</h2>
            </div>

            <div className="relative mb-6">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input type="text" placeholder="Search plans..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500" />
            </div>

            {loadingPlans ? (
              <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div></div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {filteredPlans.map(plan => <PlanCard key={plan._id} plan={plan} selected={selectedPlan?._id === plan._id} onSelect={setSelectedPlan} />)}
              </div>
            )}

            {selectedPlan && (
              <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 lg:static lg:bg-transparent lg:border-0 lg:p-0">
                <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Selected Plan</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{selectedPlan.planName} - ₹{selectedPlan.price}</p>
                  </div>
                  <Button size="lg" onClick={() => setShowConfirmation(true)}>Pay ₹{selectedPlan.price}</Button>
                </div>
              </div>
            )}
          </>
        )}

        {showConfirmation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Confirm Recharge</h3>
                <button onClick={() => setShowConfirmation(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"><FiX className="w-5 h-5" /></button>
              </div>
              <div className="space-y-2 mb-6">
                <DetailRow label="Mobile" value={formValues.phone} />
                <DetailRow label="Operator" value={formValues.operator} />
                <DetailRow label="Plan" value={selectedPlan?.planName} />
                <DetailRow label="Validity" value={selectedPlan?.validity} />
                <DetailRow label="Data" value={selectedPlan?.data} />
                {selectedPlan?.addOns && <DetailRow label="Add-ons" value={selectedPlan.addOns} />}
                <DetailRow label="Amount" value={`₹${selectedPlan?.price}`} highlight />
              </div>
              <div className="flex gap-4">
                <Button variant="secondary" className="flex-1" onClick={() => setShowConfirmation(false)}>Cancel</Button>
                <Button className="flex-1" loading={loading} onClick={handleRecharge}>Pay Now</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Recharge;
