import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import RepresentativeTable from "./RepresentativeTable";
import CreateRepresentativeForm from "./CreateRepresentativeForm";
import StatsGrid from "./StatsGrid";
import { fetchRepresentatives } from "../../../services/operations/adminServices";
import {
  setLoading,
  setRepresentatives,
  setError,
} from "../../../slices/representativesSlice";
import Modal from "../Modal";

const RepresentativesDashboard = () => {
  const dispatch = useDispatch();
  const { representatives, loading, error } = useSelector(
    (state) => state.representatives
  );
  const { token } = useSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadRepresentatives = async () => {
    try {
      dispatch(setLoading(true));

      // Check Redux state (assuming `representatives` is in state)
      const stateReps = useSelector((state) => state.representatives);

      // Check local storage
      const localStorageReps = JSON.parse(
        localStorage.getItem("representatives")
      );

      if (
        stateReps.length === 0 &&
        (!localStorageReps || localStorageReps.length === 0)
      ) {
        // Fetch representatives from API if none found
        const reps = await fetchRepresentatives(token);
        dispatch(setRepresentatives(reps));

        // Store in localStorage for future use
        localStorage.setItem("representatives", JSON.stringify(reps));
      } else {
        // If data is found in local storage, use it to set representatives in Redux
        dispatch(setRepresentatives(localStorageReps || stateReps));
      }
    } catch (err) {
      dispatch(setError("Failed to fetch representatives"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    loadRepresentatives();
  }, [dispatch, token]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    skillset: "Customer Support",
    status: "Available",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await loadRepresentatives();
    setFormData({
      name: "",
      email: "",
      skillset: "Customer Support",
      status: "Available",
    });
    setIsModalOpen(false);
  };

  console.log("Representativedash:", representatives);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="lg:text-3xl md:text-3xl text-2xl font-bold text-gray-900">
              Representatives
            </h1>
            <p className="text-gray-500 mt-1">
              Manage your support team members
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-2 py-2 lg:py-1 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 text-sm md:text-base lg:text-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="hidden sm:inline">Representative Credentials</span>
            <span className="inline sm:hidden">Credentials</span>
          </button>
        </div>

        {/* Stats Grid */}
        <StatsGrid representatives={representatives} />

        {/* Representatives Table */}
        <RepresentativeTable
          representatives={representatives}
          onRefresh={loadRepresentatives}
        />
      </div>

      {/* Add Representative Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Representative"
      >
        <CreateRepresentativeForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          setIsModalOpen={setIsModalOpen}
        />
      </Modal>
    </div>
  );
};

export default RepresentativesDashboard;
