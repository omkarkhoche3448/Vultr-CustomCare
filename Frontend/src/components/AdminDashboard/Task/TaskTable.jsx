import React from "react";
import { UserCircle, PencilIcon, TrashIcon } from "lucide-react";
import TaskStatusBadge from "./TaskStatusBadge";

const TaskTable = ({ tasks, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 bg-gray-50">
        <div className="col-span-4 font-semibold">Project Details</div>
        <div className="col-span-2 font-semibold">Customer</div>
        <div className="col-span-2 font-semibold">Team Members</div>
        <div className="col-span-2 font-semibold">Status</div>
        <div className="col-span-2 font-semibold">Actions</div>
      </div>
      {tasks.map((task) => (
        <div
          key={task.id}
          className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 hover:bg-gray-50"
        >
          <div className="col-span-4">
            <p className="font-medium text-gray-900">{task.projectTitle}</p>
            <p className="text-sm text-gray-500">{task.description}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {task.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
          <div className="col-span-2">
            <p className="font-medium text-gray-900">{task.customerName}</p>
          </div>
          <div className="col-span-2">
            <div className="flex flex-col gap-1">
              {task.assignedMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <UserCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className=" flex flex-col">
                  <span className="text-sm">{member.name}</span>
                  <span className="text-sm">{member.role}</span>
                  </div>
                
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-2">
            <TaskStatusBadge status={task.status} />
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <button
              onClick={() => onEdit(task)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <PencilIcon className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <TrashIcon className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskTable;
