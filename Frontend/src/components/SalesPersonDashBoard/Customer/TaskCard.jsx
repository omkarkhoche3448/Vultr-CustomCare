import React, { useState, useMemo, useEffect } from "react";
import {
  Calendar,
  Clock,
  Users,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Search,
  ChevronDown,
} from "lucide-react";

function TaskCard({ task, isActive: propIsActive, onToggle }) {
  // Generate a unique key for this task's state in localStorage
  const storageKey = `taskCard_${task.projectTitle.replace(/\s+/g, "_")}`;

  // Initialize state from localStorage or prop
  const [isActiveInternal, setIsActiveInternal] = useState(() => {
    const stored = localStorage.getItem(storageKey);
    return stored !== null ? JSON.parse(stored) : propIsActive;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [customerStatus, setCustomerStatus] = useState(
    task.customers.reduce(
      (acc, customer) => ({
        ...acc,
        [customer.email]: customer.status || false,
      }),
      {}
    )
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sync internal state with localStorage
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(isActiveInternal));
  }, [isActiveInternal, storageKey]);

  // Handle toggle with local state
  const handleToggle = () => {
    const newState = !isActiveInternal;
    setIsActiveInternal(newState);
    onToggle && onToggle(newState);
  };

  const filteredCustomers = useMemo(() => {
    return task.customers.filter((customer) =>
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [task.customers, searchTerm]);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const completedCount = Object.values(customerStatus).filter(
    (status) => status
  ).length;

  const currentCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCustomers, currentPage]);

  const handleCustomerToggle = (email) => {
    setCustomerStatus((prev) => ({
      ...prev,
      [email]: !prev[email],
    }));
  };

  return (
    <div
      className={`bg-white shadow-lg rounded-lg overflow-hidden mb-4 transition-all duration-300 ${
        isActiveInternal ? "w-full" : "w-80"
      }`}
    >
      <div className="bg-gray-200 p-4 text-black flex justify-between items-center">
        <h2 className="text-xl font-bold truncate">{task.projectTitle}</h2>
        <button onClick={handleToggle} className="focus:outline-none">
          {isActiveInternal ? (
            <ChevronRight size={24} />
          ) : (
            <ChevronDown size={24} />
          )}
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <AlertCircle className="text-yellow-500 mr-2" />
            <span className="font-semibold">{task.status}</span>
          </div>
          <div className="flex items-center">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                task.priority === "High"
                  ? "bg-red-100 text-red-800"
                  : task.priority === "Medium"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {task.priority} Priority
            </span>
          </div>
        </div>

        {isActiveInternal && (
          <>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2 flex items-center justify-between">
                <span className="flex items-center">
                  <Users className="mr-2" /> Customers
                </span>
                <span className="text-sm text-gray-600">
                  Completed: {completedCount}/{task.customers.length}
                </span>
              </h3>
              <div className="mb-4 relative">
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 pl-8 border rounded-md"
                />
                <Search
                  className="absolute left-2 top-2.5 text-gray-400"
                  size={18}
                />
              </div>
              <ul className="bg-gray-50 rounded-lg p-2 space-y-2 max-h-80 overflow-y-auto">
                {currentCustomers.map((customer) => (
                  <li
                    key={customer.email}
                    className="flex items-center justify-between p-2 hover:bg-gray-100 rounded"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold mr-3">
                        {customer.email[0].toUpperCase()}
                      </div>
                      <span className="text-sm">{customer.email}</span>
                    </div>
                    <button
                      onClick={() => handleCustomerToggle(customer.email)}
                      className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      {customerStatus[customer.email] ? (
                        <CheckCircle className="text-green-500" size={20} />
                      ) : (
                        <XCircle className="text-gray-400" size={20} />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
              {totalPages > 1 && (
                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span>
                    {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-between text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="mr-2" />
                <span>
                  Assigned: {new Date(task.assignedDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2" />
                <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TaskCard;
