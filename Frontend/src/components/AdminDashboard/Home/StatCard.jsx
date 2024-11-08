import React from "react";
import  { ArrowUp,Icon } from "lucide-react";

function StatCard({ title, value, icon: Icon, change, gradient }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className={`bg-gradient-to-r ${gradient} p-1`} />
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">{value}</h3>
            <p className="text-sm text-green-600 flex items-center mt-2">
              <ArrowUp className="w-4 h-4 mr-1" />
              {change}
            </p>
          </div>
          <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
            <Icon className="w-6 h-6 text-gray-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatCard;
