import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import Select from 'react-select';
import { useState } from 'react';

const CreateRepresentativeForm = ({ setIsModalOpen }) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      skillset: null,
      status: null
    }
  });

  const skillsetOptions = [
    { value: 'Customer Support', label: 'Customer Support' },
    { value: 'Technical Support', label: 'Technical Support' },
  ];

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
    { value: 'Training', label: 'Training' },
  ];

  const onSubmit = (data) => {
    // Transform the data to handle react-select values
    const formattedData = {
      ...data,
      skillset: data.skillset?.value,
      status: data.status?.value
    };
    console.log(formattedData);
    // Handle form submission
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        {/* Full Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            id="name"
            className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            {...register('name', { 
              required: 'Name is required',
              minLength: { value: 2, message: 'Name must be at least 2 characters' }
            })}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Email Address Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            id="email"
            className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field with Show/Hide Toggle */}
        <div className="relative">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Password must be at least 8 characters' }
            })}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-3 flex items-center mt-5 text-gray-500 focus:outline-none"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* Skillset Dropdown using react-select */}
        <div>
          <label htmlFor="skillset" className="block text-sm font-medium text-gray-700">
            Skillset
          </label>
          <Controller
            name="skillset"
            control={control}
            rules={{ required: 'Skillset is required' }}
            render={({ field }) => (
              <Select
                {...field}
                options={skillsetOptions}
                className="mt-1"
                classNamePrefix="select"
                placeholder="Select a skillset"
                isClearable
              />
            )}
          />
          {errors.skillset && (
            <p className="mt-1 text-sm text-red-600">{errors.skillset.message}</p>
          )}
        </div>

        {/* Status Dropdown using react-select */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <Controller
            name="status"
            control={control}
            rules={{ required: 'Status is required' }}
            render={({ field }) => (
              <Select
                {...field}
                options={statusOptions}
                className="mt-1"
                classNamePrefix="select"
                placeholder="Select a status"
                isClearable
              />
            )}
          />
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
          )}
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