import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Clock,
  Users,
  AlertCircle,
  Phone,
  PhoneCall,
  ChevronRight,
  ChevronLeft,
  Search,
  ChevronDown,
} from "lucide-react";
import { fetchRepresentativeTasks } from "../../../services/operations/representativeServices";
import { useDispatch, useSelector } from "react-redux";
import TaskCard from "./TaskCard";

function CustomerTracking() {
  const [activeTaskId, setActiveTaskId] = useState(null);

  const dispatch = useDispatch();
  const {
    assignedTasks: tasks,
    loading,
    error,
  } = useSelector((state) => state.representatives);
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && user) {
      dispatch(fetchRepresentativeTasks(token, user));
    }
  }, [dispatch, token, user]);
  console.log("customer tracking", tasks);

  const handleCustomerCall = (taskId, customerIndex) => {
    console.log("Customer call initiated for taskId:", taskId);
    console.log("Customer index:", customerIndex);
  };

  const handleTaskToggle = (taskId) => {
    setActiveTaskId((prevActiveTaskId) =>
      prevActiveTaskId === taskId ? null : taskId
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen w-full mx-auto">
      <div className="p-1">
        <h1 className="text-xl sm:text-3xl font-semibold text-gray-900 mb-5">
          Customer Dashboard Overview
        </h1>
        <p className="text-gray-600 text-sm mt-1 mb-5 font-medium">
          Stay Ahead by Tracking Your Customer Interactions
        </p>
      </div>
      <div className="flex flex-wrap gap-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.taskId}
            task={task}
            onCustomerCall={handleCustomerCall}
            isActive={activeTaskId === task.taskId}
            onToggle={() => handleTaskToggle(task.taskId)}
          />
        ))}
      </div>
    </div>
  );
}

export default CustomerTracking;
