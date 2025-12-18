import { FiCheck, FiWifi, FiCalendar, FiGift } from 'react-icons/fi';

const PlanCard = ({
  plan,
  selected = false,
  onSelect,
  showDetails = true,
  className = '',
}) => {
  // API Schema: { planName, price, data, validity, addOns, _id }
  const { planName, price, data, validity, addOns } = plan;

  return (
    <div
      onClick={() => onSelect && onSelect(plan)}
      className={`
        relative rounded-xl border-2 p-4 transition-all duration-200 cursor-pointer
        ${selected
          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-lg ring-2 ring-orange-200 dark:ring-orange-800'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-orange-300 dark:hover:border-orange-600 hover:shadow-md'
        }
        ${className}
      `}
    >
      {selected && (
        <div className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full p-1 shadow-md">
          <FiCheck className="w-4 h-4" />
        </div>
      )}

      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 pr-2">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">{planName}</h3>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-orange-500 dark:text-orange-400">₹{price}</p>
        </div>
      </div>

      {showDetails && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <FiCalendar className="w-4 h-4 text-orange-500" />
              <span>{validity}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <FiWifi className="w-4 h-4 text-orange-400" />
              <span>{data}</span>
            </div>
          </div>

          {addOns && (
            <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
                <FiGift className="w-3 h-3 text-orange-500 mt-0.5 flex-shrink-0" />
                <span>{addOns}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlanCard;
