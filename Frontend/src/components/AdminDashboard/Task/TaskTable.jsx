import React from 'react';
import {
  UserCircle,
  PencilIcon,
  Trash2,
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  MoreVertical,
} from "lucide-react";

const TaskStatusBadge = ({ status }) => {
  const statusStyles = {
    completed: "bg-green-100 text-green-800",
    "in-progress": "bg-blue-100 text-blue-800",
    pending: "bg-yellow-100 text-yellow-800",
    cancelled: "bg-red-100 text-red-800"
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
    </span>
  );
};

const TaskTable = ({ tasks, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('all');
  const [showFilterDropdown, setShowFilterDropdown] = React.useState(false);
  const [sortConfig, setSortConfig] = React.useState({ key: null, direction: 'asc' });

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || task.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const sortedTasks = React.useMemo(() => {
    if (!sortConfig.key) return filteredTasks;

    return [...filteredTasks].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredTasks, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto border border-gray-200">
        <table className="w-full min-w-[1024px]">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="w-4/12 p-4 text-left font-medium text-gray-600 cursor-pointer"
                onClick={() => handleSort('projectTitle')}
              >
                <div className="flex items-center gap-2">
                  Project Details
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </th>
              <th 
                className="w-2/12 p-4 text-left font-medium text-gray-600 cursor-pointer"
                onClick={() => handleSort('customerName')}
              >
                <div className="flex items-center gap-2">
                  Customer
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </th>
              <th className="w-2/12 p-4 text-left font-medium text-gray-600">
                Team Members
              </th>
              <th 
                className="w-2/12 p-4 text-left font-medium text-gray-600 cursor-pointer"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-2">
                  Status
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </th>
              <th className="w-2/12 p-4 text-left font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedTasks.map((task) => (
              <tr key={task.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <p className="font-medium text-gray-900">{task.projectTitle}</p>
                  <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {task.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4">
                  <p className="font-medium text-gray-900">{task.customerName}</p>
                </td>
                <td className="p-4">
                  <div className="flex flex-col gap-2">
                    {task.assignedMembers.map((member) => (
                      <div key={member.id} className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                          <UserCircle className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">{member.name}</span>
                          <span className="text-xs text-gray-500">{member.role}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="p-4">
                  <TaskStatusBadge status={task.status} />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(task)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Edit task"
                    >
                      <PencilIcon className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => onDelete(task.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskTable;