import React from "react";
import {ChevronLeft, ChevronRight} from  "lucide-react";

function PaginationControls({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
}) {
  return (
    <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
      <div className="text-sm text-gray-600">
        Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
        {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
        entries
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded border ${
            currentPage === 1
              ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
              : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => onPageChange(index + 1)}
            className={`px-3 py-1 rounded border ${
              currentPage === index + 1
                ? "bg-blue-50 text-blue-600 border-blue-200"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded border ${
            currentPage === totalPages
              ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
              : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
          }`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default PaginationControls;
