import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRepresentativeTasks } from "../../../services/operations/representativeServices";
import {
  Clock,
  Search,
  Filter,
  CheckCircle,
  Circle,
  User,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";

const TaskDashboard = () => {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [expandedTasks, setExpandedTasks] = useState({});

  const dispatch = useDispatch();
  const {
    assignedTasks: tasks,
    loading,
    error,
  } = useSelector((state) => state.representatives);
  const { user, token } = useSelector((state) => state.auth);
  const userEmail = user.email;

  const [completedTasks, setCompletedTasks] = useState(new Set());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const uniqueCategories = ["all", "high", "medium", "low"];

  const handleRedirect = (task) => {
    const taskId = task.taskId;
    const projectTitle = task.projectTitle;

    // Assuming `task.customer` is an array of customer objects with an `email` property
    const customerEmails = task.customers
      .map((customer) => customer.email)
      .join(",");
    console.log("customerEmails:", customerEmails);

    // Construct the URL with the customer emails as a parameter
    const redirectUrl = `http://localhost:5174/dashboard?email=${encodeURIComponent(
      userEmail
    )}&taskId=${encodeURIComponent(taskId)}&projectTitle=${encodeURIComponent(
      projectTitle
    )}&customerEmails=${encodeURIComponent(customerEmails)}`;

    // Redirect to the new app (Running on a different port)
    window.location.href = redirectUrl;
  };

  useEffect(() => {
    if (token && user) {
      dispatch(fetchRepresentativeTasks(token, user));
    }
  }, [dispatch, token, user]);

  const toggleTaskExpansion = (index) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleFilter = (category) => {
    setSelectedPriority(category);
    setDropdownOpen(false);
  };

  const handleTaskCompletion = (projectTitle) => {
    setCompletedTasks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(projectTitle)) {
        newSet.delete(projectTitle);
      } else {
        newSet.add(projectTitle);
      }
      return newSet;
    });
  };

  const filteredTasks = useMemo(() => {
    if (!tasks) return [];
    return tasks.filter((task) => {
      const matchesSearch =
        searchTerm === "" ||
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.customerName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPriority =
        selectedPriority === "all" ||
        task.priority.toLowerCase() === selectedPriority.toLowerCase();

      const isCompleted = completedTasks.has(task.projectTitle);
      const matchesFilter =
        filter === "all"
          ? true
          : filter === "pending"
          ? !isCompleted
          : filter === "completed"
          ? isCompleted
          : true;

      return matchesSearch && matchesPriority && matchesFilter;
    });
  }, [tasks, searchTerm, selectedPriority, filter, completedTasks]);

  const getPriorityClasses = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "text-red-700 border-red-200 bg-red-50";
      case "medium":
        return "text-yellow-700 border-yellow-200 bg-yellow-50";
      case "low":
        return "text-green-700 border-green-200 bg-green-50";
      default:
        return "text-gray-700 border-gray-200 bg-gray-50";
    }
  };

  const toggleExpand = (taskId) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Task Management
            </h1>
            <p className="text-gray-500 mt-1">
              Manage your Tasks Assigned by Admin
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-md transition ${
                filter === "all"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-3 py-1 rounded-md transition ${
                filter === "pending"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-3 py-1 rounded-md transition ${
                filter === "completed"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
          <div className="relative flex-grow space-x-2">
            <input
              type="text"
              placeholder="Search tasks by title or customer"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[80%] pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          </div>

          {/* Priority Filter */}
          <div className="relative inline-block ">
            <button
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span className="mr-2">
                {selectedPriority.charAt(0).toUpperCase() +
                  selectedPriority.slice(1)}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute top-full mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                <div className="py-1">
                  {uniqueCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => toggleFilter(category)}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        selectedPriority === category
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {category === "all"
                        ? "All Priorities"
                        : category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="text-gray-600 text-md px-4 tracking-wide">
          Click on TaskTitle to make a call
        </div>

        {/* Task List */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div
                key={task.projectTitle}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleTaskCompletion(task.projectTitle)}
                      className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
                    >
                      {completedTasks.has(task.projectTitle) ? (
                        <CheckCircle
                          className="text-green-500 hover:text-green-600"
                          size={24}
                        />
                      ) : (
                        <Circle
                          className="text-gray-300 hover:text-gray-400"
                          size={24}
                        />
                      )}
                    </button>
                    <div>
                      <p
                        className={`font-medium cursor-pointer ${
                          completedTasks.has(task.projectTitle)
                            ? "line-through text-gray-500"
                            : "text-gray-900"
                        }`}
                        onClick={() => handleRedirect(task)}
                      >
                        {task.projectTitle}
                      </p>
                      <div className="flex items-center mt-1 space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock size={14} className="mr-1" />
                          <span>Due: {task.dueDate}</span>
                        </div>
                        <div className="flex items-center">
                          <User size={14} className="mr-1" />
                          <span>
                            {task.assignedMembers
                              .map((member) => member.name)
                              .join(", ")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityClasses(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </div>
                    <button
                      onClick={() => toggleTaskExpansion(task.projectTitle)}
                      className="p-1 hover:bg-gray-100 rounded-full"
                    >
                      {expandedTasks[task.projectTitle] ? (
                        <ChevronUp size={20} className="text-gray-500" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
                {console.log("fixing keywords here", task)}
                {expandedTasks[task.projectTitle] && (
                  <div className="px-4 pb-4 border-t border-gray-100 mt-2 pt-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-1">
                          Description
                        </h4>
                        <p className="text-sm text-gray-600">
                          {task.description}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-1">
                          Keywords To Cover
                        </h4>
                        <p className="text-sm text-gray-600 flex flex-wrap">
                          {task.keywords.map((keyword) => (
                            <span
                              key={keyword}
                              className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700 mr-2 mb-2"
                            >
                              {keyword}
                            </span>
                          ))}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-1">
                          Customer Count
                          <span className="text-sm text-gray-600 ml-2">
                            {task.customers?.length || 0}
                          </span>
                        </h4>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-1">
                          Script/Notes
                        </h4>
                        <div className="text-sm text-gray-600">
                          <p
                            className={`${
                              !expandedTasks[task.id] && "line-clamp-3"
                            }`}
                          >
                            {task.script}
                          </p>
                          {task.script?.length > 400 && (
                            <button
                              onClick={() => toggleExpand(task.id)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-1 flex items-center gap-1"
                            >
                              {expandedTasks[task.id] ? (
                                <>
                                  Show Less
                                  <ChevronUp size={16} />
                                </>
                              ) : (
                                <>
                                  See More
                                  <ChevronDown size={16} />
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const priorityConfig = {
  high: {
    color: "text-red-600",
    border: "border-red-200",
    bg: "bg-red-50",
    hover: "hover:bg-red-100",
  },
  medium: {
    color: "text-amber-600",
    border: "border-amber-200",
    bg: "bg-amber-50",
    hover: "hover:bg-amber-100",
  },
  low: {
    color: "text-green-600",
    border: "border-green-200",
    bg: "bg-green-50",
    hover: "hover:bg-green-100",
  },
};

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const Modal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Confirm Task Completion</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        <div className="mb-6">
          <p className="text-gray-700">
            Are you sure you want to mark this task as complete?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This action will update the task status and cannot be undone
            immediately.
          </p>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDashboard;
