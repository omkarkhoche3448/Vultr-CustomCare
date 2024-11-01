// taskslices use kr backend sevices use kr ani api calls handling doned then

import React, { useState } from "react";
import { Plus, Search, ChevronDown, Filter } from "lucide-react";
import TaskTable from "./TaskTable";
import TaskForm from "./TaskForm";
import Modal from "../Modal";
import SearchBar from "../SearchBar";

const TaskDashboard = () => {
  // State management
  const [tasks, setTasks] = useState([
    {
      id: 1,
      projectTitle: "Website Redesign",
      description:
        "Complete overhaul of client website with modern design principles",
      script:
        "Initial consultation completed. Design phase beginning next week.",
      customerName: "Acme Corp",
      keywords: ["web design", "UI/UX", "responsive"],
      assignedMembers: [{ id: 2, name: "Jane Smith", role: "Developer" }],
      status: "in-progress",
    },
    {
      id: 2,
      projectTitle: "Mobile App Development",
      description: "Create a new mobile app for inventory management",
      script:
        "Requirements gathering phase. Architecture planning in progress.",
      customerName: "TechStart Inc",
      keywords: ["mobile", "iOS", "Android", "inventory"],
      assignedMembers: [
        { id: 3, name: "Mike Johnson", role: "Mobile Developer" },
      ],
      status: "pending",
    },
  ]);

  const [teamMembers] = useState([
    { id: 1, name: "John Doe", role: "Lead Designer" },
    { id: 2, name: "Jane Smith", role: "Developer" },
    { id: 3, name: "Mike Johnson", role: "Mobile Developer" },
    { id: 4, name: "Sarah Wilson", role: "Project Manager" },
    { id: 5, name: "Tom Brown", role: "UI/UX Designer" },
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Status options for filter
  const statusOptions = [
    "all",
    "completed",
    "in-progress",
    "pending",
    "cancelled",
  ];

  // Event Handlers
  const handleCreateTask = (taskData) => {
    const newTask = {
      id: tasks.length + 1,
      ...taskData,
      status: "pending",
    };
    setTasks([...tasks, newTask]);
    setIsCreateModalOpen(false);
  };

  const handleUpdateTask = (taskData) => {
    setTasks(
      tasks.map((task) =>
        task.id === selectedTask.id ? { ...task, ...taskData } : task
      )
    );
    setIsUpdateModalOpen(false);
    setSelectedTask(null);
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleEditClick = (task) => {
    setSelectedTask(task);
    setIsUpdateModalOpen(true);
  };

  const handleFilterClick = () => {
    setShowFilterDropdown(!showFilterDropdown);
  };

  const handleStatusSelect = (status) => {
    setFilterStatus(status);
    setShowFilterDropdown(false);
  };

  // Filter tasks based on search query and status
  const filteredTasks = tasks
    .filter(
      (task) =>
        task.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((task) =>
      filterStatus === "all" ? true : task.status === filterStatus
    );

  // Click outside handler for filter dropdown
  React.useEffect(() => {
    const handleClickOutside = () => {
      setShowFilterDropdown(false);
    };

    if (showFilterDropdown) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showFilterDropdown]);

  return (
    <div className=" bg-gray-50 min-h-screen px-8 pt-6 pb-8 mb-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
        <p className="text-gray-500 mt-1">
          Manage customer Task and Team assignments
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="Search Tasks..."
          />

          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleFilterClick();
              }}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm w-[20%] text-gray-700">
                {filterStatus === "all"
                  ? "Filter"
                  : filterStatus.charAt(0).toUpperCase() +
                    filterStatus.slice(1).replace("-", " ")}
              </span>
            </button>

            {showFilterDropdown && (
              <div className="absolute top-full mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusSelect(status);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors duration-150 ${
                        filterStatus === status
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700"
                      }`}
                    >
                      {status.charAt(0).toUpperCase() +
                        status.slice(1).replace("-", " ")}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 text-sm md:text-base lg:text-lg transition-colors duration-200"
        >
          <Plus className="w-5 h-5" />
          Create Project
        </button>
      </div>

      <TaskTable
        tasks={filteredTasks}
        onEdit={handleEditClick}
        onDelete={handleDeleteTask}
      />

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Project"
      >
        <TaskForm
          teamMembers={teamMembers}
          onSubmit={handleCreateTask}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedTask(null);
        }}
        title="Update Project"
      >
        <TaskForm
          task={selectedTask}
          teamMembers={teamMembers}
          onSubmit={handleUpdateTask}
          onCancel={() => {
            setIsUpdateModalOpen(false);
            setSelectedTask(null);
          }}
          isUpdate={true}
        />
      </Modal>
    </div>
  );
};

export default TaskDashboard;
