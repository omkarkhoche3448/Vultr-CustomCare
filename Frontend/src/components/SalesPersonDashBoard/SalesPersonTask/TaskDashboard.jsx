import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../../../services/operations/taskServices';
import { setError } from '../../../slices/taskSlice';
import { toast } from 'react-hot-toast';
import TaskList from './TaskList';

const TaskDashboard = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [pageSize] = useState(20);

  const tasks = useSelector(state => state.task.tasks);
  const loading = useSelector(state => state.task.loading);
  const error = useSelector(state => state.task.error);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const queryParams = {
          status: statusFilter,
          page: currentPage,
          limit: pageSize,
        };
        await dispatch(fetchTasks(queryParams));
      } catch (err) {
        console.error('Error loading tasks:', err);
        toast.error(err.message || "Failed to fetch tasks");
      }
    };

    loadTasks();
  }, [dispatch, currentPage, statusFilter, pageSize]);

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  return (
    <div className="p-6">
      <div className="mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 md:mb-0">
            Sales Task Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <select
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={handleStatusChange}
            >
              <option value="ALL">All Tasks</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Tasks List */}
        <div className="grid gap-6">
          {!loading && tasks?.activeTasks?.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500">No tasks available.</p>
            </div>
          ) : (
            tasks?.activeTasks?.map(task => (
              <TaskList key={task.id} task={task} />
            ))
          )}
        </div>

        {/* Pagination */}
        {tasks?.pagination && tasks.activeTasks?.length > 0 && (
          <div className="flex items-center justify-between mt-8 bg-white p-4 rounded-lg shadow-sm">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg ${
                currentPage === 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage(prev => prev - 1)}
              disabled={!tasks.pagination.hasPrevious}
              className={`px-4 py-2 rounded-lg ${
                !tasks.pagination.hasPrevious
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Previous
            </button>
            <span className="text-gray-600">
              Page {currentPage} of {tasks.pagination.totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={!tasks.pagination.hasNext}
              className={`px-4 py-2 rounded-lg ${
                !tasks.pagination.hasNext
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Next
            </button>
            <button
              onClick={() => setCurrentPage(tasks.pagination.totalPages)}
              disabled={!tasks.pagination.hasNext}
              className={`px-4 py-2 rounded-lg ${
                !tasks.pagination.hasNext
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Last
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDashboard;