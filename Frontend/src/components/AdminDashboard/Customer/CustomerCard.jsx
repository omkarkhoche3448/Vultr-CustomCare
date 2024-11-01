import { User, MoreVertical } from "lucide-react";
const CustomerCard = ({ customer }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
          <User className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{customer.customername}</h3>
          <p className="text-sm text-gray-500">{customer.category}</p>
        </div>
      </div>
      <button className="text-gray-400 hover:text-gray-600">
        <MoreVertical className="w-5 h-5" />
      </button>
    </div>

    <div className="mt-4">
      <div className="text-sm text-gray-600">
        <span className="font-medium">Product Demand:</span>{" "}
        {customer.productdemand}
      </div>
    </div>

    <div className="mt-4">
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-50 text-purple-600">
        {customer.category}
      </span>
    </div>
  </div>
);

export default CustomerCard;
