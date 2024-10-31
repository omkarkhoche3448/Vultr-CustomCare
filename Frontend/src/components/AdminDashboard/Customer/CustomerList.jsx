import React from "react";

const CustomerList = ({ customers }) => {
  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full">
      <h2 className="text-2xl font-bold mb-4">Customers</h2>
      <div className="space-y-4">
        {customers.map((customer) => (
          <div className="bg-white shadow-md rounded px-6 py-4">
            <h3 className="text-lg font-bold">{customer.name}</h3>
            <p className="text-gray-700">{customer.email}</p>
            <p className="text-gray-500">Phone: {customer.phone}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerList;
