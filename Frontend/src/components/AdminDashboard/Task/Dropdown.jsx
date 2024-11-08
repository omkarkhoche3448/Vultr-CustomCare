import React from 'react';
import Select from 'react-select';
import { UserCircle } from 'lucide-react';

const CustomSelect = ({
  isMulti = false,
  options,
  value,
  onChange,
  placeholder,
  isDisabled = false,
  className = '',
  error = null,
  label = '',
  showSelectAll = false,
  onSelectAll = null,
  selectAllChecked = false
}) => {
  const baseStyles = {
    control: (base) => ({
      ...base,
      minHeight: '45px',
      backgroundColor: '#f8fafc',
      border: 'none',
      borderRadius: '0.75rem',
      boxShadow: 'none',
      '&:hover': {
        border: 'none',
      },
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: '#e0e7ff',
      borderRadius: '0.5rem',
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: '#4f46e5',
      fontWeight: '500',
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: '#4f46e5',
      '&:hover': {
        backgroundColor: '#c7d2fe',
        color: '#4338ca',
      },
    }),
    menu: (base) => ({
      ...base,
      borderRadius: '0.5rem',
    }),
  };

  return (
    <div className="space-y-2">
      {(label || showSelectAll) && (
        <div className="flex justify-between items-center">
          {label && (
            <label className="text-sm font-medium text-slate-600">
              {label}
            </label>
          )}
          {showSelectAll && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectAllChecked}
                onChange={onSelectAll}
                disabled={isDisabled}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-600">Select All</span>
            </div>
          )}
        </div>
      )}
      <Select
        isMulti={isMulti}
        options={options}
        value={value}
        onChange={onChange}
        isDisabled={isDisabled}
        className={`react-select-container ${className}`}
        classNamePrefix="react-select"
        placeholder={placeholder}
        isClearable={true}
        isSearchable={true}
        closeMenuOnSelect={!isMulti}
        styles={baseStyles}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

// Customer Select Component
const CustomerSelect = ({
  customers,
  selectedCategory,
  selectedCustomers,
  onChange,
  error,
  onSelectAll,
  selectAllChecked
}) => {
  const customerOptions = customers.map((customer) => ({
    value: customer.id,
    label: `${customer.customername || 'No Name'} - ${customer.email || 'No Email'} - ${customer.productdemand || 'No Product'}`,
    customer: {
      id: customer.id,
      name: customer.customername,
      email: customer.email,
      productDemand: customer.productdemand,
      category: customer.category,
    },
  }));

  const handleChange = (selectedOptions) => {
    const selectedCustomerData = selectedOptions?.map(option => ({
      id: option.customer.id,
      name: option.customer.name,
      email: option.customer.email,
      productDemand: option.customer.productDemand,
      category: option.customer.category,
    })) || [];
    onChange(selectedCustomerData);
  };

  return (
    <CustomSelect
      isMulti={true}
      options={customerOptions}
      value={customerOptions.filter(option => 
        selectedCustomers?.some(selected => selected.id === option.value)
      )}
      onChange={handleChange}
      isDisabled={!selectedCategory}
      placeholder={selectedCategory ? "Select customers..." : "Please select a category first"}
      label="Customers"
      error={error}
      showSelectAll={true}
      onSelectAll={onSelectAll}
      selectAllChecked={selectAllChecked}
    />
  );
};

// Team Member Select Component
const TeamMemberSelect = ({
  teamMembers,
  value,
  onChange,
  error
}) => {
  const teamMemberOptions = teamMembers.map((member) => ({
    value: member.id,
    label: (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
          <UserCircle className="w-4 h-4 text-gray-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">{member.name}</p>
          <p className="text-xs text-gray-500">{member.skillset}</p>
        </div>
      </div>
    ),
    member
  }));

  const handleChange = (selected) => {
    onChange(selected ? selected.member : null);
  };

  const selectedValue = value ? {
    value: value.id,
    label: (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
          <UserCircle className="w-4 h-4 text-gray-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">{value.name}</p>
          <p className="text-xs text-gray-500">{value.skillset}</p>
        </div>
      </div>
    ),
    member: value
  } : null;

  return (
    <CustomSelect
      isMulti={false}
      options={teamMemberOptions}
      value={selectedValue}
      onChange={handleChange}
      placeholder="Select team member..."
      label="Team Members"
      error={error}
    />
  );
};

export { CustomSelect, CustomerSelect, TeamMemberSelect };