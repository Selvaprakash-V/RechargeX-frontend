import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSearch, FiSave, FiCreditCard } from 'react-icons/fi';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import InputField from '../../components/InputField';
import API from '../../api/api';

// Schema matching MongoDB: { provider, planName, price, data, validity, addOns }
const schema = yup.object({
  provider: yup.string().required('Provider is required'),
  planName: yup.string().required('Plan name is required'),
  price: yup.number().positive('Price must be positive').required('Price is required'),
  validity: yup.string().required('Validity is required'),
  data: yup.string().required('Data is required'),
  addOns: yup.string(),
}).required();

const ManagePlans = () => {
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Fetch plans
  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await API.get('/plans');
      const data = response.data;
      setPlans(data);
      setFilteredPlans(data);
    } catch (error) {
      console.error('Error fetching plans:', error);
      setPlans([]);
      setFilteredPlans([]);
    }
    setLoading(false);
  };

  // Filter plans
  useEffect(() => {
    if (searchTerm) {
      setFilteredPlans(plans.filter(p => 
        p.planName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.price?.toString().includes(searchTerm) ||
        p.addOns?.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    } else {
      setFilteredPlans(plans);
    }
  }, [searchTerm, plans]);

  const openModal = (plan = null) => {
    setEditingPlan(plan);
    if (plan) {
      reset({
        provider: plan.provider,
        planName: plan.planName,
        price: plan.price,
        validity: plan.validity,
        data: plan.data,
        addOns: plan.addOns || '',
      });
    } else {
      reset({
        provider: '',
        planName: '',
        price: '',
        validity: '',
        data: '',
        addOns: '',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPlan(null);
    reset();
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    
    try {
      if (editingPlan) {
        // Update plan
        const response = await API.put(`/plans/${editingPlan._id}`, data);
        
        if (response.status === 200) {
          const updatedPlan = response.data;
          setPlans(plans.map(p => p._id === editingPlan._id ? updatedPlan : p));
        }
      } else {
        // Create plan
        const response = await API.post('/plans', data);
        
        if (response.status === 201) {
          const newPlan = response.data;
          setPlans([...plans, newPlan]);
        }
      }
      
      closeModal();
    } catch (error) {
      console.error('Error saving plan:', error);
      alert('Failed to save plan');
    }
    
    setSubmitting(false);
  };

  const deletePlan = async (id) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;
    
    try {
      await API.delete(`/plans/${id}`);
      setPlans(plans.filter(p => p._id !== id));
    } catch (error) {
      console.error('Error deleting plan:', error);
      alert('Failed to delete plan');
    }
  };

  return (
    <Layout>
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Manage Plans
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create, edit, and manage recharge plans
          </p>
        </div>
        <Button onClick={() => openModal()}>
          <FiPlus className="w-5 h-5 mr-2" />
          Add New Plan
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search plans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Plans Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        ) : filteredPlans.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Validity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Add-ons
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {filteredPlans.map((plan) => (
                  <tr key={plan._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 rounded-lg">
                          <FiCreditCard className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{plan.planName}</p>
                          <p className="text-sm text-gray-500">{plan.provider}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-green-600">₹{plan.price}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                      {plan.validity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                      {plan.data}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300 max-w-[200px] truncate">
                      {plan.addOns || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openModal(plan)}
                          className="p-2 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deletePlan(plan._id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <FiCreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No plans found</p>
            <Button className="mt-4" onClick={() => openModal()}>
              <FiPlus className="w-4 h-4 mr-2" />
              Create First Plan
            </Button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editingPlan ? 'Edit Plan' : 'Add New Plan'}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Provider
                </label>
                <select
                  {...register('provider')}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select Provider</option>
                  <option value="airtel">Airtel</option>
                  <option value="jio">Jio</option>
                  <option value="vi">Vi</option>
                  <option value="bsnl">BSNL</option>
                </select>
                {errors.provider && (
                  <p className="mt-1 text-sm text-red-500">{errors.provider.message}</p>
                )}
              </div>

              <InputField
                label="Plan Name"
                placeholder="e.g., Basic Talktime Pack"
                error={errors.planName?.message}
                {...register('planName')}
              />

              <InputField
                label="Price (₹)"
                type="number"
                placeholder="e.g., 299"
                error={errors.price?.message}
                {...register('price')}
              />

              <InputField
                label="Validity"
                placeholder="e.g., 28 days"
                error={errors.validity?.message}
                {...register('validity')}
              />

              <InputField
                label="Data"
                placeholder="e.g., 2GB/day"
                error={errors.data?.message}
                {...register('data')}
              />

              <InputField
                label="Add-ons"
                placeholder="e.g., Unlimited calls, 100 SMS/day"
                error={errors.addOns?.message}
                {...register('addOns')}
              />

              <div className="flex gap-4 pt-4">
                <Button type="submit" loading={submitting} className="flex-1">
                  <FiSave className="w-4 h-4 mr-2" />
                  {editingPlan ? 'Update Plan' : 'Create Plan'}
                </Button>
                <Button type="button" variant="secondary" onClick={closeModal}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ManagePlans;
