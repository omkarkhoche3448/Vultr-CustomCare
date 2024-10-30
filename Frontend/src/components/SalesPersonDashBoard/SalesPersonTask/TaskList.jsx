import React from 'react';
import { Clock, User, Tag, CheckCircle, Loader, AlertCircle } from 'lucide-react';

const TaskList = ({ task }) => {
  const getStatusConfig = (status) => {
    const config = {
      COMPLETED: {
        bgColor: 'bg-emerald-100',
        textColor: 'text-emerald-700',
        icon: <CheckCircle className="w-4 h-4 mr-1" />,
      },
      ACTIVE: {
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-700',
        icon: <Loader className="w-4 h-4 mr-1" />,
      },
      PENDING: {
        bgColor: 'bg-amber-100',
        textColor: 'text-amber-700',
        icon: <AlertCircle className="w-4 h-4 mr-1" />,
      },
    };
    return config[status?.toUpperCase()] || {
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-700',
      icon: null,
    };
  };

  const statusConfig = getStatusConfig(task.status);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4 hover:shadow-md transition-all duration-200 group">
      <div className="flex justify-between items-start mb-5">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {task.projectTitle}
          </h3>
          <p className="text-md text-gray-500">
            {task.description}
          </p>
        </div>
        <div className={`flex items-center ${statusConfig.bgColor} ${statusConfig.textColor} px-3 py-1.5 rounded-full text-sm font-medium`}>
          {statusConfig.icon}
          {task.status}
        </div>
      </div>

      {task.keywords?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {task.keywords.map((keyword, index) => (
            <span 
              key={index}
              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Tag className="w-3 h-3 mr-1" />
              {keyword}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm text-gray-600">
            <User className="w-4 h-4 mr-2 text-gray-400" />
            <span className="hover:text-gray-900 transition-colors">{task.assignedTo}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2 text-gray-400" />
            <span>{task.lastUpdated}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskList;