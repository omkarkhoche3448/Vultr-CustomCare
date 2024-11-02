import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { UserCircle, X } from "lucide-react";

const TaskForm = ({
  task = {},
  teamMembers = [],
  onSubmit,
  onCancel,
  isUpdate = false,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      customerName: task.customerName || "",
      projectTitle: task.projectTitle || "",
      description: task.description || "",
      script: task.script || "",
      keywords: task.keywords || [],
      assignedMembers: task.assignedMembers || [],
      status: task.status || "pending",
    },
  });

  const [currentKeyword, setCurrentKeyword] = useState("");
  const keywords = watch("keywords");

  const handleAddKeyword = (e) => {
    e.preventDefault();
    if (currentKeyword.trim() && !keywords.includes(currentKeyword.trim())) {
      setValue("keywords", [...keywords, currentKeyword.trim()]);
      setCurrentKeyword("");
    }
  };

  const handleRemoveKeyword = (keywordToRemove) => {
    setValue(
      "keywords",
      keywords.filter((keyword) => keyword !== keywordToRemove)
    );
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

  const onSubmitForm = (data) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      {/* Customer Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Customer Name
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register("customerName", { required: "Customer name is required" })}
        />
        {errors.customerName && (
          <p className="mt-1 text-sm text-red-600">{errors.customerName.message}</p>
        )}
      </div>

      {/* Project Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Project Title
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register("projectTitle", { required: "Project title is required" })}
        />
        {errors.projectTitle && (
          <p className="mt-1 text-sm text-red-600">{errors.projectTitle.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
          {...register("description", { required: "Description is required" })}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      {/* Script */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Script
        </label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
          {...register("script", { required: "Script is required" })}
        />
        {errors.script && (
          <p className="mt-1 text-sm text-red-600">{errors.script.message}</p>
        )}
      </div>

      {/* Keywords */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Keywords
        </label>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2 mb-2">
            {keywords.map((keyword, index) => (
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

      {/* Team Members Select */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Assign Team Members
        </label>
        <Controller
          name="assignedMembers"
          control={control}
          rules={{ required: "Please assign at least one team member" }}
          render={({ field }) => (
            <Select
              {...field}
              isMulti
              options={memberOptions}
              value={memberOptions.filter((option) =>
                field.value.includes(option.value)
              )}
              onChange={(selected) =>
                field.onChange(selected ? selected.map((option) => option.value) : [])
              }
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Select team members..."
            />
          )}
        />
        {errors.assignedMembers && (
          <p className="mt-1 text-sm text-red-600">{errors.assignedMembers.message}</p>
        )}
      </div>

      {/* Status Select (for updates only) */}
      {isUpdate && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("status", { required: "Status is required" })}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>
      )}

      {/* Form Actions */}
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