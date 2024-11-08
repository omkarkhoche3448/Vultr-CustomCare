import React from "react";
import Select from "react-select";
import { UserCircle } from "lucide-react";
import { useState, useEffect, useMemo } from "react";

export const CustomerSelect = ({
  customers,
  selectedCategory,
  selectedCustomers,
  onChange,
  error,
  onSelectAll,
  selectAllChecked,
}) => {
  const [isOpen, setIsOpen] = useState(false); // Toggle dropdown visibility
  const [searchQuery, setSearchQuery] = useState(""); // Handle search query
  const [selected, setSelected] = useState(selectedCustomers || []); // Track selected customers

  const customerOptions = customers.map((customer) => ({
    value: customer.id,
    label: `${customer.customername || "No Name"} - ${
      customer.email || "No Email"
    }`,
    customer,
  }));

  // Handle selection/deselection of customers
  const handleSelect = (customer) => {
    const newSelected = selected.some((item) => item.id === customer.id)
      ? selected.filter((item) => item.id !== customer.id) // Deselect
      : [...selected, customer]; // Select
    setSelected(newSelected);
    onChange(newSelected); // Update the parent component with selected customers
  };

  // Handle the 'Select All' / 'Deselect All' functionality
  const handleSelectAll = () => {
    if (selectAllChecked) {
      setSelected([]); // Deselect all if 'Select All' is not checked
      onChange([]);
    } else {
      setSelected(customerOptions.map((option) => option.customer)); // Select all customers
      onChange(customerOptions.map((option) => option.customer));
    }
    onSelectAll(); // Notify the parent component about the selection change
  };

  // Filter customers based on the search query
  const filteredOptions = customerOptions.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-slate-600">Customers</label>
        {selectedCategory && (
          <button
            type="button"
            onClick={handleSelectAll}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {selectAllChecked ? "Deselect All" : "Select All"}
          </button>
        )}
      </div>

      {/* Input Field to Toggle Dropdown */}
      <div
        onClick={() => setIsOpen(!isOpen)} // Toggle dropdown open/close
        className="cursor-pointer border border-gray-300 rounded-lg p-3 flex items-center justify-between w-full"
      >
        <p className="text-sm font-medium">
          {selected.length > 0
            ? `${selected.length} selected`
            : "Select customers..."}
        </p>
        <div>{isOpen ? "▲" : "▼"}</div>
      </div>

      {/* Search Input Field */}
      {isOpen && (
        <input
          type="text"
          placeholder="Search customers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mt-2 w-full border border-gray-300 rounded-lg p-2"
        />
      )}

      {/* Dropdown List */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-[270px] bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => {
              const isSelected = selected.some(
                (customer) => customer.id === option.value
              );
              return (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option.customer)}
                  className={`cursor-pointer hover:bg-gray-100 p-3 flex items-center gap-2 ${
                    isSelected ? "bg-blue-100" : ""
                  }`}
                >
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600">✔</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{option.label}</p>
                    <p className="text-xs text-gray-500">
                      {option.customer.productDemand}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-3 text-sm text-gray-500">No customers found</div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export const TeamMemberSelect = ({ teamMembers, value, onChange, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMembers = teamMembers.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (member) => {
    onChange(member);
    setIsOpen(false);
  };

  return (
    <div className="relative space-y-2">
      <label className="text-sm font-medium text-slate-600">
        Assigned Team Member
      </label>

      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="cursor-pointer border border-gray-300 rounded-lg p-3 flex items-center justify-between w-full"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
            <UserCircle className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-sm font-medium">
            {value ? value.name : "Select a team member..."}
          </p>
        </div>
        <div className="ml-2">{isOpen ? "▲" : "▼"}</div>
      </div>

      {/* Search Input for Filtering */}
      {isOpen && (
        <input
          type="text"
          placeholder="Search team members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mt-2 w-full border border-gray-300 rounded-lg p-2"
        />
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member) => (
              <div
                key={member.id}
                onClick={() => handleSelect(member)}
                className="cursor-pointer hover:bg-gray-100 p-3 flex items-center gap-2"
              >
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserCircle className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">{member.name}</p>
                  <p className="text-xs text-gray-500">{member.skillset}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-3 text-sm text-gray-500">No members found</div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export const CategoryCustomerSection = ({
  customers,
  selectedCategory,
  selectedCustomers,
  setValue,
  errors,
  availableCustomers,
  setAvailableCustomers,
  selectAllChecked,
  handleCategoryChange,
  handleSelectAllCustomers,
}) => {
  // Memoize category options to avoid recalculating unnecessarily
  const categoryOptions = useMemo(() => {
    const uniqueCategories = [
      ...new Set(customers.map((customer) => customer.category)),
    ];

    return uniqueCategories
      .sort((a, b) => a.localeCompare(b))
      .map((category) => ({
        value: category.toLowerCase(),
        label:
          category.charAt(0).toUpperCase() + category.slice(1).toLowerCase(),
      }));
  }, [customers]);

  // Handle category change from the dropdown
  const handleCategorySelect = (selectedOption) => {
    handleCategoryChange(selectedOption); // Using passed function
  };

  // Handle customer selection or deselection
  const handleCustomerSelect = (customer) => {
    const newSelectedCustomers = selectedCustomers.some(
      (selected) => selected.id === customer.id
    )
      ? selectedCustomers.filter((selected) => selected.id !== customer.id)
      : [...selectedCustomers, customer];

    setValue("customers", newSelectedCustomers);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Category Dropdown */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-600">Category</label>
        <div
          className="cursor-pointer border border-gray-300 rounded-lg p-3 flex justify-between items-center"
          onClick={() => setCategoryDropdownOpen((prev) => !prev)}
        >
          <span>
            {selectedCategory
              ? categoryOptions.find((opt) => opt.value === selectedCategory)
                  ?.label
              : "Select category..."}
          </span>
          <span>{isCategoryDropdownOpen ? "▲" : "▼"}</span>
        </div>

        {/* Category Dropdown List */}
        {isCategoryDropdownOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {categoryOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => handleCategorySelect(option)}
                className={`cursor-pointer hover:bg-gray-100 p-3 text-sm ${
                  selectedCategory === option.value ? "bg-blue-100" : ""
                }`}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Customer Multi-Select with Select All */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-600">Customers</label>

        {/* Select All Button */}
        {selectedCategory && (
          <button
            type="button"
            onClick={handleSelectAllCustomers} // Using passed function
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {selectAllChecked ? "Deselect All" : "Select All"}
          </button>
        )}

        <div className="border border-gray-300 rounded-lg p-3 max-h-60 overflow-y-auto">
          {availableCustomers.map((customer) => {
            const isSelected = selectedCustomers.some(
              (selected) => selected.id === customer.id
            );
            return (
              <div
                key={customer.id}
                onClick={() => handleCustomerSelect(customer)} // Handling customer selection
                className={`cursor-pointer hover:bg-gray-100 p-3 flex items-center gap-2 ${
                  isSelected ? "bg-blue-100" : ""
                }`}
              >
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  {isSelected && <span className="text-blue-600">✔</span>}
                </div>
                <div>
                  <p className="text-sm font-medium">{`${customer.customername} - ${customer.email}`}</p>
                  <p className="text-xs text-gray-500">
                    {customer.productDemand}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Error Message */}
        {errors?.customers && (
          <p className="text-red-500 text-sm mt-1">
            {errors.customers.message}
          </p>
        )}
      </div>
    </div>
  );
};
