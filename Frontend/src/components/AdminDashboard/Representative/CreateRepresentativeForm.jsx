import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Select from 'react-select';
import Modal from "../Modal"

const CreateRepresentativeForm = ({
  formData,
  handleInputChange,
  handleSubmit,
  setIsModalOpen,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  // Options for react-select dropdowns
  const skillsetOptions = [
    { value: 'Customer Support', label: 'Customer Support' },
    { value: 'Technical Support', label: 'Technical Support' },
  ];

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
    { value: 'Training', label: 'Training' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Full Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            value={formData.name}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Email Address Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Password Field with Show/Hide Toggle */}
        <div className="relative">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            id="password"
            required
            value={formData.password}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-3 flex items-center mt-5 text-gray-500 focus:outline-none"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>

        {/* Skillset Dropdown using react-select */}
        <div>
          <label htmlFor="skillset" className="block text-sm font-medium text-gray-700">
            Skillset
          </label>
          <Select
            options={skillsetOptions}
            value={skillsetOptions.find(option => option.value === formData.skillset)}
            onChange={(selectedOption) => handleInputChange({ target: { name: 'skillset', value: selectedOption.value } })}
            className="mt-1"
            placeholder="Select a skillset"
          />
        </div>

        {/* Status Dropdown using react-select */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <Select
            options={statusOptions}
            value={statusOptions.find(option => option.value === formData.status)}
            onChange={(selectedOption) => handleInputChange({ target: { name: 'status', value: selectedOption.value } })}
            className="mt-1"
            placeholder="Select a status"
          />
        </div>
      </div>

      {/* Notification Option */}
      <p className="text-sm text-gray-500">
        The representative will receive the credentials directly, or you can schedule a meeting for further assistance.
      </p>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={() => setIsModalOpen(false)}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Representative
        </button>
      </div>
    </form>
  );
};

export default CreateRepresentativeForm;
