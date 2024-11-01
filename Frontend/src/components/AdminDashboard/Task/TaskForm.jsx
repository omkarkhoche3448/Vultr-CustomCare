import React, { useState } from "react";
import Select from "react-select";
import { UserCircle, X } from "lucide-react";
import { createTask,assignTask } from "../../../services/operations/adminServices";

const TaskForm = ({
  task = {},
  teamMembers = [],
  onSubmit,
  onCancel,
  isUpdate = false,
}) => {
  const [formData, setFormData] = useState({
    customerName: task.customerName || "",
    projectTitle: task.projectTitle || "",
    description: task.description || "",
    script: task.script || "",
    keywords: task.keywords || [],
    assignedMembers: task.assignedMembers || [],
    status: task.status || "pending",
  });

  const [currentKeyword, setCurrentKeyword] = useState("");

  const handleAddKeyword = (e) => {
    e.preventDefault();
    if (currentKeyword.trim() && !formData.keywords.includes(currentKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, currentKeyword.trim()]
      }));
      setCurrentKeyword("");
    }
  };

  const handleRemoveKeyword = (keywordToRemove) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(keyword => keyword !== keywordToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const memberOptions = teamMembers.map((member) => ({
    value: member.id,
    label: (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
          <UserCircle className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-medium">{member.name}</p>
          <p className="text-xs text-gray-500">{member.role}</p>
        </div>
      </div>
    ),
    member,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Customer Name
        </label>
        <input
          type="text"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.customerName}
          onChange={(e) =>
            setFormData({ ...formData, customerName: e.target.value })
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Project Title
        </label>
        <input
          type="text"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.projectTitle}
          onChange={(e) =>
            setFormData({ ...formData, projectTitle: e.target.value })
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Script
        </label>
        <textarea
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
          value={formData.script}
          onChange={(e) => setFormData({ ...formData, script: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Keywords
        </label>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.keywords.map((keyword, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {keyword}
                <button
                  type="button"
                  onClick={() => handleRemoveKeyword(keyword)}
                  className="ml-2 focus:outline-none"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={currentKeyword}
              onChange={(e) => setCurrentKeyword(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a keyword"
            />
            <button
              type="button"
              onClick={handleAddKeyword}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Assign Team Members
        </label>
        <Select
          isMulti
          options={memberOptions}
          value={memberOptions.filter((option) =>
            formData.assignedMembers.includes(option.value)
          )}
          onChange={(selected) =>
            setFormData({
              ...formData,
              assignedMembers: selected
                ? selected.map((option) => option.value)
                : [],
            })
          }
          className="react-select-container"
          classNamePrefix="react-select"
          placeholder="Select team members..."
        />
      </div>

      {isUpdate && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {isUpdate ? "Update Project" : "Create Project"}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;