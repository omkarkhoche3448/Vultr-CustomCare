

// taskslices use kr backend sevices use kr ani api calls handling doned then
  
  import React, { useState } from "react";
  import { Plus, Search, ChevronDown } from "lucide-react";
  import TaskTable from "./TaskTable";
  import TaskForm from "./TaskForm";
  import Modal from "./Modal";

  const TaskDashboard = () => {
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
    const [selectedTask, setSelectedTask] = useState(tasks);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

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

    const filteredTasks = tasks
      .filter(
        (task) =>
          task.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .filter((task) =>
        filterStatus === "all" ? true : task.status === filterStatus
      );

    return (
      <div className="min-h-screen px-8 pt-6 pb-8 mb-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
          <p className="text-gray-600">
            Manage customer Task and Team assignments
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4 items-center">
            <div className="relative ">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects..."
                className="pl-10  pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative">
              <select
                className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
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
