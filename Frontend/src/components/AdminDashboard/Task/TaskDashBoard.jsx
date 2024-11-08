import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../Modal";
import TaskForm from "./TaskForm";
import TaskTable from "./TaskTable";
import {
  fetchRepresentatives,
  fetchCustomers,
  fetchTasks,
} from "../../../services/operations/adminServices";
import Loader from "../Loader";
import { setTasks } from "../../../slices/taskSlice";

const RepresentativeTaskDashboard = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { representatives } = useSelector((state) => state.representatives);
  const { customers } = useSelector((state) => state.customers);
  const { tasks } = useSelector((state) => state.task);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        const [repsData, customersData, tasksData] = await Promise.all([
          fetchRepresentatives(token),
          dispatch(fetchCustomers(token)),
          dispatch(fetchTasks(token)),
        ]);

        console.log("Data loaded successfully:", {
          repsData,
          customersData,
          tasksData,
        });
        localStorage.setItem("representatives", JSON.stringify(repsData));
        localStorage.setItem("customers", JSON.stringify(customersData));
        localStorage.setItem("tasks", JSON.stringify(tasksData));
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadAllData();
  }, [dispatch, token]);

  console.log("Rep:", representatives);
  console.log("Cust:", customers);
  console.log("Task:", tasks);

  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const filteredTasks =
    Array.isArray(tasks) && tasks.length > 0
      ? tasks.filter(
          (task) => statusFilter === "ALL" || task.status === statusFilter
        )
      : [];

  const indexOfLastTask = currentPage * pageSize;
  const indexOfFirstTask = indexOfLastTask - pageSize;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / pageSize);

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
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

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleTaskSubmit = async (data) => {
    try {
      console.log("New task data:", data);
      const tasksData = await fetchTasks(token);
      dispatch(setTasks(tasksData));
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error submitting task:", error);
    }
  };

  const handleEdit = (task) => {
    // Open edit modal/form
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleDelete = async (taskId) => {
    try {
      // Show confirmation dialog
      const confirmed = window.confirm(
        "Are you sure you want to delete this task?"
      );

      if (confirmed) {
        // Make API call to delete task
        // await deleteTask(taskId);

        // Update local state by filtering out the deleted task
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

        // Show success message
        toast.success("Task deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    }
  };

  return (
    <div className="mx-auto">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center p-8 bg-gray-50 border-b">
          <div>
            <h1 className="lg:text-3xl md:text-3xl text-2xl font-bold text-gray-900">
              Representatives Tasks Dashboard
            </h1>
            <p className="text-gray-500 mt-2">
              View and manage tasks assigned to representatives, track progress,
              and update statuses efficiently.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Status Filter */}
            <div className="flex items-center space-x-4">
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
              className="inline-flex items-center px-4 py-2 lg:py-1 text-white font-medium text-sm md:text-base lg:text-lg bg-purple-600 hover:bg-purple-700 rounded-lg"
            >
              Assign New Task
            </button>
          </div>
        </div>

        <TaskTable
          tasks={tasks}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />

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
        {filteredTasks.length === 0 && <Loader />}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Assign New Task"
      >
        {/* <TaskForm
          teamMembers={representatives}
          onSubmit={handleTaskSubmit}
          onCancel={() => setIsModalOpen(false)}
          isUpdate={false}
        /> */}
        <TaskForm
          task={tasks}
          teamMembers={representatives}
          onSubmit={handleTaskSubmit}
          onCancel={() => setIsModalOpen(false)}
          customers={customers}
        />
      </Modal>
    </div>
  );
};

export default RepresentativeTaskDashboard;
