import React from "react";
import {
  UserCircle,
  PencilIcon,
  Trash2,
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  MoreVertical,
  ChevronDown,
} from "lucide-react";
import { useMemo, useState } from "react";

const Loader = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
  </div>
);

const TaskStatusBadge = ({ status }) => {
  const statusStyles = {
    completed: "bg-green-100 text-green-800",
    "in-progress": "bg-blue-100 text-blue-800",
    pending: "bg-yellow-100 text-yellow-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
        statusStyles[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
    </span>
  );
};

const DropdownMenu = ({ trigger, children, align = "right" }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div
          className={`absolute z-10 mt-2 ${
            align === "right" ? "right-0" : "left-0"
          } w-48 `}
        >
          <div className="py-1">{children}</div>
        </div>
      )}
    </div>
  );
};

const TaskTable = ({
  tasks: initialTasks,
  onEdit,
  onCancel,
  onDelete,
  loading = false,
}) => {
  const [tasks, setTasks] = React.useState(initialTasks);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState("all");
  const [selectedTasks, setSelectedTasks] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage] = React.useState(10);
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: "asc",
  });

  React.useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const handleTaskSelect = (taskId) => {
    if (Array.isArray(taskId)) {
      setSelectedTasks(taskId);
    } else {
      setSelectedTasks((prev) =>
        prev.includes(taskId)
          ? prev.filter((id) => id !== taskId)
          : [...prev, taskId]
      );
    }
  };
  const filteredTasks = useMemo(() => {
    // Early return with empty array if tasks is invalid
    if (!tasks || !Array.isArray(tasks)) {
      console.warn("Tasks data is not in the expected format:", tasks);
      return [];
    }

    try {
      return tasks.filter((task) => {
        // Safely access properties with optional chaining and nullish coalescing
        const projectTitle = task?.projectTitle ?? "";
        const description = task?.description ?? "";
        const customerName = task?.customerName ?? "";
        const status = task?.status ?? "";

        // Convert search term to lowercase once
        const searchLower = searchTerm.toLowerCase();

        const matchesSearch =
          searchTerm === "" ||
          [projectTitle, description, customerName].some((field) =>
            field.toLowerCase().includes(searchLower)
          );

        const matchesFilter = filterStatus === "all" || status === filterStatus;

        return matchesSearch && matchesFilter;
      });
    } catch (error) {
      console.error("Error filtering tasks:", error);
      return [];
    }
  }, [tasks, searchTerm, filterStatus]);

  const sortedTasks = React.useMemo(() => {
    if (!sortConfig.key) return filteredTasks;

    return [...filteredTasks].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredTasks, sortConfig]);

  const paginatedTasks = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedTasks.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedTasks, currentPage, itemsPerPage]);

  const pageCount = Math.ceil(sortedTasks.length / itemsPerPage);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  if (!filteredTasks.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] p-4 rounded-lg">
        <div className="text-gray-600 font-medium mb-2">No tasks found</div>
        <div className="text-gray-500 text-sm">
          {searchTerm || filterStatus !== "all"
            ? "Try adjusting your filters or search term"
            : "Refresh to see all tasks"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex gap-4 mb-4 px-5 py-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu
          trigger={
            <button className="px-4 py-2 border border-gray-300 rounded-md inline-flex items-center gap-2 hover:bg-gray-50">
              <Filter className="h-4 w-4" />
              Filter
              <ChevronDown className="h-4 w-4" />
            </button>
          }
        >
          {["all", "completed", "in-progress", "pending", "cancelled"].map(
            (status) => (
              <button
                key={status}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setFilterStatus(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            )
          )}
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-4">
            <Loader />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="lg:w-full md:w-full w-[130%]  ">
              {/* Header */}
              <div className="grid grid-cols-[40px_1fr_1fr_1fr_1fr_40px] md:grid-cols-[40px_2fr_2fr_1fr_2fr_40px] gap-4 bg-gray-50 p-4 items-center border-b border-gray-200">
                <div>
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-purple-600"
                    checked={selectedTasks.length === paginatedTasks.length}
                    onChange={(e) => {
                      handleTaskSelect(
                        e.target.checked ? paginatedTasks.map((t) => t.id) : []
                      );
                    }}
                  />
                </div>

                {["Project Title", "Description", "Status", "Team Members"].map(
                  (header) => (
                    <div
                      key={header}
                      onClick={() =>
                        handleSort(header.toLowerCase().replace(" ", ""))
                      }
                      className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    >
                      <span>{header}</span>
                      <ArrowUpDown
                        className={`w-4 h-4 ${
                          sortConfig.key ===
                          header.toLowerCase().replace(" ", "")
                            ? "text-purple-600"
                            : "text-gray-400"
                        }`}
                      />
                    </div>
                  )
                )}
                <div className="sr-only">Actions</div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-gray-200">
                {paginatedTasks.map((task) => (
                  <div
                    key={task.taskId}
                    className={`grid grid-cols-[40px_1fr_1fr_1fr_1fr_40px] md:grid-cols-[40px_2fr_2fr_1fr_2fr_40px] gap-4 p-4 items-center ${
                      selectedTasks.includes(task.id)
                        ? "bg-gray-100"
                        : "bg-white"
                    } hover:bg-gray-50`}
                  >
                    <div>
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-purple-600"
                        checked={selectedTasks.includes(task.id)}
                        onChange={() => handleTaskSelect(task.id)}
                      />
                    </div>

                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {task.projectTitle}
                      </div>
                      <div className="text-sm text-gray-500">
                        {task.keywords?.slice(0, 3).join(", ")}
                        {task.keywords?.length > 3 && ", ..."}
                      </div>
                    </div>

                    <div className="text-sm text-gray-900">
                      {task.description?.length > 50
                        ? `${task.description.substring(0, 50)}...`
                        : task.description}
                    </div>

                    <div>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full
                ${
                  task.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : task.status === "in-progress"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
                      >
                        {task.status}
                      </span>
                    </div>

                    <div className="flex -space-x-2">
                      {task.assignedMembers
                        ?.slice(0, 3)
                        .map((member, index) => (
                          <div
                            key={index}
                            className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center border-2 border-white relative"
                          >
                            <span className="text-purple-600 text-xs font-medium">
                              {member.name?.charAt(0)?.toUpperCase()}
                            </span>
                            <div className="absolute -right-12 top-2 text-sm text-gray-900 w-full text-center">
                              {member.name}
                            </div>
                          </div>
                        ))}
                      {(task.assignedMembers?.length || 0) > 3 && (
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center border-2 border-white">
                          <span className="text-gray-600 text-xs font-medium">
                            +{task.assignedMembers.length - 3}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <DropdownMenu
                        trigger={
                          <button className="text-gray-400 hover:text-gray-600 sm:text-sm md:text-base lg:text-lg">
                            <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                          </button>
                        }
                      >
                        <div className="flex flex-col absolute right-8 -top-14 bg-white border border-gray-300 rounded-md shadow-lg z-50 w-40">
                          <button
                            className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => onEdit?.(task)}
                          >
                            <PencilIcon className="h-4 w-4 mr-2" />
                            Edit
                          </button>
                          <button
                            className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                            onClick={() => onDelete?.(task.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </button>
                        </div>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex justify-between items-center pt-4">
          <div className="text-sm text-gray-700">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, sortedTasks.length)} of{" "}
            {sortedTasks.length} results
          </div>
          <div className="flex gap-2">
            <button
              className={`px-4 py-2 border border-gray-300 rounded-md ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "hover:bg-gray-50"
              }`}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <button
              className={`px-4 py-2 border border-gray-300 rounded-md ${
                currentPage === pageCount
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "hover:bg-gray-50"
              }`}
              disabled={currentPage === pageCount}
              onClick={() => setCurrentPage((p) => Math.min(pageCount, p + 1))}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskTable;
