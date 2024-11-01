import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  Plus,
  MoreVertical,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
  User,
} from "lucide-react";
import CustomerCard from "./CustomerCard";
import SearchBar from "../SearchBar";
import UploadCSV from "../UploadCSV";
import Modal from "../Modal";

const CustomerDashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState(["all"]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [viewMode, setViewMode] = useState("table");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    // Simulate fetching data from your service
    const fetchCustomers = async () => {
      try {
        // Replace this with your actual API call endpoint use krne form the services folder
        const response = await fetch("/api/customers");
        const data = await response.json();
        setCustomers(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching customers:", error);
        // Fallback data for demonstration
        setCustomers([
          {
            id: 1,
            customername: "manthan",
            productdemand: "samsung S24 Ultra",
            category: "Mobile",
          },
          {
            id: 2,
            customername: "soham",
            productdemand: "sony bravia 4k oled",
            category: "TV",
          },
          {
            id: 3,
            customername: "pragati",
            productdemand: "apple macbook pro",
            category: "Laptop",
          },
          {
            id: 4,
            customername: "omkar",
            productdemand: "smart 450l double door fridge",
            category: "Refrigerator",
          },
        ]);
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCustomerSelect = (customerId) => {
    setSelectedCustomers((prev) =>
      prev.includes(customerId)
        ? prev.filter((id) => id !== customerId)
        : [...prev, customerId]
    );
  };

  const toggleFilter = (status) => {
    setSelectedFilters(
      (prevFilters) =>
        prevFilters.includes(status)
          ? prevFilters.filter((filter) => filter !== status) // Remove the filter if it's already selected
          : [...prevFilters, status] // Add the filter if it's not selected
    );
  };

  const handleOpenModal = () => {
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  const handleUploadComplete = (response) => {
    console.log("Uploaded data response:", response);
    handleCloseModal(); // Close modal after upload
  };

  const filteredCustomers = customers.filter((customer) => {
    const searchString = Object.values(customer).join(" ").toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key].toLowerCase();
    const bValue = b[sortConfig.key].toLowerCase();

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const paginatedCustomers = sortedCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedCustomers.length / itemsPerPage);

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Customers</h2>
          <p className="mt-1  text-gray-500">
            Manage and monitor customer product demands
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenModal}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>

          <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            title="Upload CSV"
          >
            <UploadCSV onUpload={handleUploadComplete} />
          </Modal>

          <button className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar
          searchQuery={searchTerm}
          setSearchQuery={setSearchTerm}
          placeholder="Search customers..."
          width="flex-1"
        />

        <div className="flex gap-3 relative">
          <button
            onClick={() => setViewMode(viewMode === "table" ? "grid" : "table")}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            {viewMode === "table" ? "Grid View" : "Table View"}
          </button>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Filter size={16} />
            <span>Filter</span>
          </button>

          {showFilters && (
            <div className="absolute top-full mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
              <div className="py-1">
                {["all", "active", "away", "offline"].map((status) => (
                  <button
                    key={status}
                    onClick={() => toggleFilter(status)} // Toggle filter status
                    className={`w-full text-left px-4 py-2 text-sm ${
                      selectedFilters.includes(status) // Check if filter is selected
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}{" "}
                    {/* Capitalize status */}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Content Section */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : viewMode === "table" ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCustomers(customers.map((c) => c.id));
                        } else {
                          setSelectedCustomers([]);
                        }
                      }}
                    />
                  </th>
                  {["Customer Name", "Product Demand", "Category"].map(
                    (header) => (
                      <th
                        key={header}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() =>
                          handleSort(header.toLowerCase().replace(" ", ""))
                        }
                      >
                        <div className="flex items-center space-x-1">
                          <span>{header}</span>
                          <ArrowUpDown className="w-4 h-4" />
                        </div>
                      </th>
                    )
                  )}
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        checked={selectedCustomers.includes(customer.id)}
                        onChange={() => handleCustomerSelect(customer.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <span className="text-purple-600 font-medium">
                            {customer.customername?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {customer.customername}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {customer.productdemand}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                        {customer.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedCustomers.map((customer) => (
            <CustomerCard key={customer.id} customer={customer} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="">
        <div className="flex items-center justify-between ">
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Showing <span>{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                <span>
                  {Math.min(currentPage * itemsPerPage, sortedCustomers.length)}
                </span>{" "}
                of <span>{sortedCustomers.length}</span> customers
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={` py-1  p-2 text-gray-600   disabled:opacity-50 disabled:cursor-not-allowed ${
                  currentPage === 1
                    ? " text-gray-400"
                    : "bg-purple-600 text-white"
                }`}
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`ml-2 px-3 py-1  ${
                  currentPage === totalPages
                    ? " text-gray-400"
                    : "bg-purple-600 text-white"
                }`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          <div className="sm:hidden">
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">{paginatedCustomers.length}</span>{" "}
              of <span className="font-medium">{filteredCustomers.length}</span>{" "}
              customers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
