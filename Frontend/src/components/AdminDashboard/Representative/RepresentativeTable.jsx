import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
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
import {
  fetchRepresentatives,
  // updateRepresentative,
  // deleteRepresentative,
} from "../../../services/operations/adminServices";
import { toast } from "react-hot-toast";
import Loader from "../Loader";

const RepresentativeTable = () => {
  const dispatch = useDispatch();
  // const { representatives, error } = useSelector(
  //   (state) => state.representatives
  // );

  const [representative, setRepresentative] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchRepresentatives(token);
        // console.log("RepresentativeTable", data);
        setRepresentative(data);
      } catch (err) {
        console.log("Error fetching representatives:", err);
      }
    };

    if (!representative || representative.length === 0) {
      fetchData();
    }
  }, [dispatch, token]);

  const sortData = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedData = [...representative].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
      s;
    });
    setRepresentatives(sortedData);
  };

  const filteredData = representative.filter((rep) => {
    const matchesSearch =
      rep.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" ||
      rep.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

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

  const handleEdit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedRep = {
      ...selectedRepresentative,
      name: formData.get("name"),
      email: formData.get("email"),
      skillset: formData.get("skillset"),
      status: formData.get("status"),
    };

    try {
      // await dispatch(updateRepresentative(token, updatedRep));
      toast.success("Representative updated successfully");
      setIsModalOpen(false);
    } catch (error) {
      // toast.error("Failed to update representative");
    }
  };

  const handleDelete = async () => {
    try {
      // await dispatch(deleteRepresentative(token, selectedRepresentative.email));
      toast.success("Representative deleted successfully");
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to delete representative");
    }
  };

  const handleRefresh = async () => {
    try {
      const data = await fetchRepresentatives(token);
      setRepresentative(data);
      setCurrentPage(1);
      toast.success("Data refreshed successfully");
    } catch (error) {
      toast.error("Failed to refresh data");
    }
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
        <div className="absolute right-5 w-fit top-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
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

  const EditRepresentativeModal = () => {
    return (
      <div>
        <form onSubmit={handleEdit}>
          <div className="flex flex-col space-y-4">
            <h2 className="text-lg font-medium">Edit Representative</h2>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                defaultValue={selectedRepresentative?.name}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                defaultValue={selectedRepresentative?.email}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="skillset"
                className="block text-sm font-medium text-gray-700"
              >
                Skillset
              </label>
              <Select
                id="skillset"
                name="skillset"
                options={skillsetOptions}
                defaultValue={{
                  value: selectedRepresentative?.skillset,
                  label: selectedRepresentative?.skillset,
                }}
                className="mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700"
              >
                Status
              </label>
              <Select
                id="status"
                name="status"
                options={statusOptions}
                defaultValue={{
                  value: selectedRepresentative?.status,
                  label: selectedRepresentative?.status,
                }}
                className="mt-1"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  };

  const DeleteRepresentativeModal = () => {
    return (
      <div>
        <h2 className="text-lg font-medium">Delete Representative</h2>
        <p>
          Are you sure you want to delete {selectedRepresentative?.name} (
          {selectedRepresentative?.email})?
        </p>
        <div className="flex justify-end mt-4">
          <button
            onClick={handleDelete}
            className="inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Delete
          </button>
          <button
            onClick={() => setIsModalOpen(false)}
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ml-2"
          >
            Cancel
          </button>
        </div>
      </div>
    );
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
              {paginatedData.length == 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 whitespace-nowrap text-center text-gray-500"
                  >
                    <Loader/>
                  </td>
                </tr>
              ) : (
                paginatedData.map((rep, index) => (
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
                ))
              )}
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
            disabled={currentPage === 1 || <Loader />}
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
            disabled={currentPage === totalPages || <Loader />}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <Modal>
        {actionType === "edit" ? (
          <EditRepresentativeModal />
        ) : actionType === "delete" ? (
          <DeleteRepresentativeModal />
        ) : null}
      </Modal>
    </div>
  );
};

export default RepresentativeTable;
