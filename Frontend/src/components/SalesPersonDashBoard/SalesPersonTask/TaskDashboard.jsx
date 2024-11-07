import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../../../services/operations/adminServices';
import { formatDistance } from 'date-fns';

const StatusBadge = ({ status }) => {
  const statusColors = {
    'COMPLETED': 'bg-green-100 text-green-800',
    'PENDING': 'bg-yellow-100 text-yellow-800',
    'IN_PROGRESS': 'bg-blue-100 text-blue-800'
  };

  const formattedStatus = status.replace('_', ' ');

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
      {formattedStatus}
    </span>
  );
};

const TaskDashboard = () => {
  const dispatch = useDispatch();
  const [statusFilter, setStatusFilter] = useState('ALL');

  const user = useSelector(state => state.auth.user);
  const tasks = useSelector(state => state.task.tasks);
  const loading = useSelector(state => state.task.loading);
  const error = useSelector(state => state.task.error);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const filteredTasks = Array.isArray(tasks) && statusFilter === 'ALL'
    ? tasks
    : Array.isArray(tasks)
      ? tasks.filter(task => task.status === statusFilter)
      : [];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mx-auto">
        <DashboardHeader user={user} />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <select 
            className="w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={handleStatusChange}
          > 
            <option value="ALL">All Tasks</option>
            <option value="COMPLETED">Completed</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
          </select>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500" />
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            {error}
          </div>
        )}

        {!loading && (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No tasks available.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map(task => (
                    <tr key={task._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{task.projectTitle}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{task.customerName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 truncate max-w-xs">{task.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{task.assignedTo}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={task.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatDistance(new Date(task.lastUpdated), new Date(), { addSuffix: true })}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const DashboardHeader = ({ user }) => (
  <div className="mb-6 bg-white border border-gray-200 rounded-lg">
    <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Task Dashboard Overview
        </h1>
        <p className="text-sm text-gray-600 mt-1">Welcome back, {user?.username}</p>
      </div>
      <div className="mt-4 sm:mt-0 flex items-center space-x-4">
        <div className="text-sm text-gray-600">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  </div>
);

export default TaskDashboard;
