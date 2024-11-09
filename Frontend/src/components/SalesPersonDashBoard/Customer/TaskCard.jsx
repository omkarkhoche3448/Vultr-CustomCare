import React, { useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  Users,
  AlertCircle,
  CheckCircle,
  Phone,
  PhoneCall,
  ChevronRight,
  ChevronLeft,
  Search,
  ChevronDown,
} from "lucide-react";

function TaskCard({ task, onCustomerCall, isActive, onToggle }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [updatedCustomers, setUpdatedCustomers] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredCustomers = useMemo(() => {
    return task.customers.filter((customer) =>
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [task.customers, searchTerm]);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const calledCount = task.customers.filter(
    (customer) => customer.called
  ).length;

  const currentCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCustomers, currentPage]);


  const handleIconClick = (customerId) => {
    const updatedCustomerList = updatedCustomers.map((customer) => {
      if (customer.id === customerId) {
        return {
          ...customer,
          called: !customer.called, 
        };
      }
      return customer;
    });

    setUpdatedCustomers(updatedCustomerList);
  };


  return (
    <div
      className={`bg-white shadow-lg rounded-lg overflow-hidden mb-4 transition-all duration-300 ${
        isActive ? "w-full" : "w-80"
      }`}
    >
      <div className=" bg-gray-200 p-4 text-black flex justify-between items-center">
        <h2 className="text-xl font-bold truncate">{task.projectTitle}</h2>
        <button onClick={onToggle} className=" focus:outline-none">
          {isActive ? <ChevronRight size={24} /> : <ChevronDown size={24} />}
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

        {isActive && (
          <>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2 flex items-center justify-between">
                <span className="flex items-center">
                  <Users className="mr-2" /> Customers
                </span>
                <span className="text-sm text-gray-600">
                  Called: {calledCount}/{task.customers.length}
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
                {currentCustomers.map((customer, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold mr-3">
                        {customer.email[0].toUpperCase()}
                      </div>
                      <span className="text-sm">{customer.email}</span>
                    </div>
                    <button
                      onClick={() =>
                        onCustomerCall(
                          task.taskId,
                          task.customers.findIndex(
                            (c) => c.email === customer.email
                          )
                        )
                      }
                      className={`p-2 rounded-full ${
                        customer.called
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {customer.length > 0 ? (
                        <PhoneCall
                          size={18}
                          className="bg-green-500 text-white p-1 rounded-full cursor-pointer"
                          onClick={() => handleIconClick(customer.id)}
                        />
                      ) : (
                        <CheckCircle
                          size={18}
                          className="bg-gray-300 text-white p-1 rounded-full cursor-pointer"
                          onClick={() => handleIconClick(customer.id)}
                        />
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
