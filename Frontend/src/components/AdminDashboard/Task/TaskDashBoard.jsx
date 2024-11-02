import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../Modal";
import TaskForm from "./TaskForm";

const RepresentativeTaskDashboard = () => {
  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [pageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();

  const teamMembers = [
    { id: 1, name: "John Doe", role: "Sales Representative" },
    { id: 2, name: "Jane Smith", role: "Account Manager" },
    { id: 3, name: "Mike Johnson", role: "Sales Manager" },
  ];

  // Mock dispatch and selector (you'll replace with actual Redux setup)
  const tasks = [
    {
      id: 1,
      title: "Follow up on Sales Lead",
      description: "Contact potential client from recent marketing campaign",
      status: "ACTIVE",
      priority: "High",
      assignedDate: "2024-02-15",
      dueDate: "2024-02-20",
    },
    {
      id: 2,
      title: "Prepare Sales Presentation",
      description:
        "Create a comprehensive pitch deck for upcoming client meeting",
      status: "PENDING",
      priority: "Medium",
      assignedDate: "2024-02-10",
      dueDate: "2024-02-25",
    },
    {
      id: 3,
      title: "Client Meeting Follow-up",
      description: "Send detailed proposal after initial discussion",
      status: "COMPLETED",
      priority: "Low",
      assignedDate: "2024-02-05",
      dueDate: "2024-02-15",
    },
  ];

  const handleTaskSubmit = (data) => {
    console.log("New task data:", data);
    // Here you would typically dispatch an action to add the task
    setIsModalOpen(false);
  };

  // Status filter handler
  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  // Filter tasks based on status
  const filteredTasks = tasks.filter(
    (task) => statusFilter === "ALL" || task.status === statusFilter
  );

  // Pagination logic
  const indexOfLastTask = currentPage * pageSize;
  const indexOfFirstTask = indexOfLastTask - pageSize;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / pageSize);

  // Priority color mapping
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-blue-100 text-blue-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className=" mx-auto  ">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center p-6 bg-gray-50 border-b">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
            Representative Task Dashboard
          </h1>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Status Filter */}
            <div className="flex items-center space-x-4 ">
              <label
                htmlFor="status-filter"
                className="text-gray-700 font-medium"
              >
                Filter by Status:
              </label>
              <select 
                id="status-filter"
                value={statusFilter}
                onChange={handleStatusChange}
                className="p-2 form-select block w-full md:w-auto border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
              >
                <option value="ALL">All Tasks</option>
                <option value="ACTIVE">Active</option>
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 lg:py-1 text-white font-medium text-sm md:text-base lg:text-lg bg-purple-600 hover:bg-purple-700 rounded-lg"            >
              Assign New Task
            </button>
          </div>
        </div>

        {/* Task Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentTasks.map((task) => (
                <tr
                  key={task.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {task.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {task.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        task.status
                      )}`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {task.assignedDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {task.dueDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredTasks.length > 0 && (
          <div className="flex items-center justify-between bg-white px-4 py-3 border-t">
            <div className="flex-1 flex justify-between items-center">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page <span className="font-medium">{currentPage}</span> of{" "}
                <span className="font-medium">{totalPages}</span>
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* No Tasks Message */}
        {filteredTasks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No tasks found matching the selected filter.
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Assign New Task"
      >
        <TaskForm
          teamMembers={teamMembers}
          onSubmit={handleTaskSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default RepresentativeTaskDashboard;
