import React, { useState } from "react";
import Select from "react-select";
import {
  Search,
  Filter,
  Download,
  Plus,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
  ArrowUpDown,
  User,
  Edit,
  Trash2,
  X,
} from "lucide-react";

const RepresentativeTable = ({ representatives: initialRepresentatives }) => {
  const [representatives, setRepresentatives] = useState(
    initialRepresentatives
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRepresentative, setSelectedRepresentative] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const itemsPerPage = 5;

  // Sorting function
  const sortData = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedData = [...representatives].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setRepresentatives(sortedData);
  };

  // Filter and search function
  const filteredData = representatives.filter((rep) => {
    const matchesSearch =
      rep.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" ||
      rep.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const skillsetOptions = [
    { value: "Customer Support", label: "Customer Support" },
    { value: "Technical Support", label: "Technical Support" },
    { value: "Sales", label: "Sales" },
  ];

  const statusOptions = [
    { value: "available", label: "Available" },
    { value: "unavailable", label: "Unavailable" },
  ];

  const handleEdit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedRep = {
      ...selectedRepresentative,
      name: formData.get("name"),
      email: formData.get("email"),
      skillset: formData.get("skillset"),
      status: formData.get("status"),
    };

    setRepresentatives(
      representatives.map((rep) =>
        rep.email === selectedRepresentative.email ? updatedRep : rep
      )
    );
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    // setRepresentatives(
    //   representatives.filter(
    //     (rep) => rep.email !== selectedRepresentative.email
    //   )
    // );
    setIsModalOpen(false);
  };

  const handleRefresh = () => {
    // window.location.reload();
  };

  const TableHeader = ({ label, sortKey }) => (
    <th
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
      onClick={() => sortKey && sortData(sortKey)}
    >
      <div className="flex items-center gap-2">
        {label}
        {sortKey && (
          <ArrowUpDown
            size={14}
            className={`transform ${
              sortConfig.key === sortKey && sortConfig.direction === "desc"
                ? "rotate-180"
                : ""
            }`}
          />
        )}
      </div>
    </th>
  );

  const FilterDropdown = () => (
    <div className="relative">
      <button
        onClick={() => setShowFilterDropdown(!showFilterDropdown)}
        className="p-2 flex items-center gap-2 text-gray-600 hover:bg-gray-100 rounded-md"
      >
        <Filter size={16} />
        <span>Filter</span>
      </button>

      {showFilterDropdown && (
        <div className="absolute top-full mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            {["all", "available", "unavailable"].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setFilterStatus(status);
                  setShowFilterDropdown(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm ${
                  filterStatus === status
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const ActionsDropdown = ({ rep, index }) => (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(showDropdown === index ? null : index)}
        className="p-2 hover:bg-gray-100 rounded-full"
      >
        <MoreVertical size={16} className="text-gray-500" />
      </button>

      {showDropdown === index && (
        <div className="absolute right-5  w-fit top-2  rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
          <div className="py-1">
            <button
              onClick={() => {
                openModal("edit", rep);
                setShowDropdown(null);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <Edit size={16} className="mr-2" />
              Edit
            </button>
            <button
              onClick={() => {
                openModal("delete", rep);
                setShowDropdown(null);
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
            >
              <Trash2 size={16} className="mr-2" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const openModal = (type, representative) => {
    setActionType(type);
    setSelectedRepresentative(representative);
    setIsModalOpen(true);
  };

  const Modal = ({ children }) => {
    if (!isModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div className="relative">{children}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search representatives..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <FilterDropdown />
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <TableHeader label="Name" sortKey="name" />
                <TableHeader label="Email" sortKey="email" />
                <TableHeader label="Skillset" sortKey="skillset" />
                <TableHeader label="Status" sortKey="status" />
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedData.map((rep, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-medium">
                        <User size={20} />
                      </div>
                      <div className="ml-4 font-medium text-gray-900">
                        {rep.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {rep.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        rep.skillset === rep.skillset
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {rep.skillset}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        rep.status === "Available"
                          ? "bg-green-100 text-green-800"
                          : rep.status === "Unavailable"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {rep.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <ActionsDropdown rep={rep} index={index} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing{" "}
          {Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)}{" "}
          to {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
          {filteredData.length} representatives
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Edit Representative Modal */}
      <Modal>
        {actionType === "edit" ? (
          <form onSubmit={handleEdit} className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {selectedRepresentative?.name
                  ? "Edit Representative"
                  : "Add Representative"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                name="name"
                type="text"
                defaultValue={selectedRepresentative?.name}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                name="email"
                type="email"
                defaultValue={selectedRepresentative?.email}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Skillset
              </label>
              <Select
                name="skillset"
                defaultValue={skillsetOptions.find(
                  (option) => option.value === selectedRepresentative?.skillset
                )}
                options={skillsetOptions}
                className="w-full"
                onChange={(selectedOption) => {
                  // Handle skillset change, if necessary
                }}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <Select
                name="status"
                defaultValue={statusOptions.find(
                  (option) => option.value === selectedRepresentative?.status
                )}
                options={statusOptions}
                className="w-full"
                onChange={(selectedOption) => {
                  // Handle status change, if necessary
                }}
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                {selectedRepresentative?.name
                  ? "Save Changes"
                  : "Add Representative"}
              </button>
            </div>
          </form>
        ) : null}
      </Modal>
    </div>
  );
};

export default RepresentativeTable;
