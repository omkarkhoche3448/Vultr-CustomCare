import React, { useState, useMemo, useEffect } from "react";
import {
  Check,
  AlertCircle,
  Clock,
  Tag,
  User,
  Calendar,
  Search,
  Filter,
} from "lucide-react";

// API Service for Task Management
const TaskService = {
  // Dummy token for authorization (in real-world, this would come from authentication)
  token: '',

  // Base URL for API (replace with actual backend URL)
  baseUrl: 'https://api.example.com/tasks',

  // Fetch Tasks
  async fetchTasks(status = 'pending') {
    try {
      // Commented out actual API call for demonstration
      // const response = await fetch(`${this.baseUrl}?status=${status}`, {
      //   method: 'GET',
      //   headers: {
      //     'Authorization': `Bearer ${this.token}`,
      //     'Content-Type': 'application/json'
      //   }
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to fetch tasks');
      // }
      
      // return await response.json();

      // Dummy data for demonstration
      return [
        {
          id: 1,
          customerName: "John Smith",
          projectTitle: "Project Alpha",
          description: "Comprehensive project analysis and initial blueprint development",
          script: "Analyze project requirements and create detailed blueprint",
          keywords: ["Analysis", "Strategic Planning", "Blueprint"],
          priority: "high",
          status: status,
          assignedTo: "representative",
          dueDate: "2024-02-15",
        },
        {
          id: 2,
          customerName: "Emily Davis",
          projectTitle: "Project Beta",
          description: "Comprehensive project documentation and timeline creation",
          script: "Document requirements and develop project timeline",
          keywords: ["Documentation", "Project Management"],
          priority: "medium",
          status: status,
          assignedTo: "representative",
          dueDate: "2024-02-20",
        }
      ];
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  },

  // Complete Task
  async completeTask(taskId) {
    try {
      // Commented out actual API call for demonstration
      // const response = await fetch(`${this.baseUrl}/${taskId}/complete`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Authorization': `Bearer ${this.token}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ status: 'completed' })
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to complete task');
      // }
      
      // return await response.json();

      // Dummy successful response
      return { 
        ...this.fetchTasks().find(task => task.id === taskId), 
        status: 'completed',
        completedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error completing task:', error);
      return null;
    }
  }
};

// Priority color configuration (kept from original)
const priorityConfig = {
  high: {
    border: "border-red-500",
    bg: "bg-red-50",
    text: "text-red-800",
    badge: "bg-red-100",
  },
  medium: {
    border: "border-amber-500",
    bg: "bg-amber-50",
    text: "text-amber-800",
    badge: "bg-amber-100",
  },
  low: {
    border: "border-green-500",
    bg: "bg-green-50",
    text: "text-green-800",
    badge: "bg-green-100",
  },
};

const RepresentativeTaskDashboard = () => {
  // State Management
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [confirmTask, setConfirmTask] = useState(null);
  
  // Loading and Error States
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Tasks Effect
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch tasks based on current filter
        const fetchedTasks = await TaskService.fetchTasks(filter);
        setTasks(fetchedTasks);
      } catch (err) {
        setError('Failed to load tasks. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [filter]);

  // Filtered and searched tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(
      (task) =>
        (searchTerm === "" ||
          task.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.customerName.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedPriority === null || task.priority === selectedPriority)
    );
  }, [tasks, searchTerm, selectedPriority]);

  // Complete task handler
  const completeTask = async (taskId) => {
    try {
      setIsLoading(true);
      const completedTask = await TaskService.completeTask(taskId);
      
      if (completedTask) {
        // Update tasks list
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === taskId ? completedTask : task
          )
        );
        setConfirmTask(null);
      }
    } catch (err) {
      setError('Failed to complete task. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Confirmation Modal (kept from original)
  const ConfirmModal = ({ task, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Confirm Task Completion
        </h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to mark
          <span className="font-semibold"> {task.projectTitle} </span>
          as completed?
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );

  // Loading Spinner Component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  // Error Message Component
  const ErrorMessage = ({ message }) => (
    <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded relative" role="alert">
      <span className="block sm:inline">{message}</span>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mx-auto space-y-8">
        {/* Header (kept from original) */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Task Management
            </h1>
            <p className="text-gray-500 mt-1">
              Manage your Tasks Assigned by Boss
            </p>
          </div>

          <div className="flex space-x-4">
            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setFilter("pending")}
                className={`px-3 py-1 rounded-md transition ${
                  filter === "pending"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter("completed")}
                className={`px-3 py-1 rounded-md transition ${
                  filter === "completed"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Completed
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search tasks by project or customer"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="text-gray-500" size={20} />
            <select
              value={selectedPriority || ""}
              onChange={(e) => setSelectedPriority(e.target.value || null)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Error Handling */}
        {error && <ErrorMessage message={error} />}

        {/* Loading State */}
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          // Tasks List (kept from original, with minor modifications)
          filteredTasks.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <AlertCircle className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-lg">No tasks found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((task) => {
                const priority = priorityConfig[task.priority];
                return (
                  <div
                    key={task.id}
                    className={`border-l-4 ${priority.border} ${priority.bg} 
                      rounded-lg p-4 hover:shadow-md transition duration-300 relative`}
                  >
                    {/* Task card content (kept from original) */}
                    <div className="flex justify-between items-start">
                      <div className="flex-1 pr-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-bold text-gray-800">
                            {task.projectTitle}
                          </h3>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium 
                              ${priority.badge} ${priority.text}`}
                          >
                            {task.priority.charAt(0).toUpperCase() +
                              task.priority.slice(1)}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 mb-2">
                          {task.description}
                        </p>

                        <div className="text-xs text-gray-500 space-y-1 mb-2">
                          <div className="flex items-center space-x-2">
                            <Clock size={14} className="text-gray-400" />
                            <span>{task.script}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <User size={14} className="text-gray-400" />
                            <span>{task.customerName}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar size={14} className="text-gray-400" />
                            <span>Due: {task.dueDate}</span>
                          </div>
                        </div>

                        {task.keywords && task.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {task.keywords.map((keyword, index) => (
                              <span
                                key={index}
                                className="flex items-center space-x-1 
                                  bg-white/50 text-gray-700 
                                  rounded-full px-2 py-1 text-xs
                                  border border-gray-200"
                              >
                                <Tag size={12} className="text-gray-500" />
                                <span>{keyword}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {task.status === "pending" && (
                        <button
                          onClick={() => setConfirmTask(task)}
                          className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full 
                            hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400
                            transition duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
                        >
                          <Check size={20} />
                        </button>
                      )}
                    </div>

                    {task.status === "completed" && task.completedAt && (
                      <div className="text-xs text-gray-500 mt-2 italic">
                        Completed on:{" "}
                        {new Date(task.completedAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmTask && (
        <ConfirmModal
          task={confirmTask}
          onConfirm={() => completeTask(confirmTask.id)}
          onCancel={() => setConfirmTask(null)}
        />
      )}
    </div>
  );
};  

export default RepresentativeTaskDashboard;
