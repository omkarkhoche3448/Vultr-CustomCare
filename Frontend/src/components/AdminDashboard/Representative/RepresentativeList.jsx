import React from "react";

const RepresentativeList = ({ representatives }) => {
  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full">
      <h2 className="text-2xl font-bold mb-4">Representatives</h2>
      <div className="space-y-4">
        {representatives.map((representative) => (
          <div className="bg-white shadow-md rounded px-6 py-4">
            <h3 className="text-lg font-bold">{representative.name}</h3>
            <p className="text-gray-700">{representative.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RepresentativeList;
