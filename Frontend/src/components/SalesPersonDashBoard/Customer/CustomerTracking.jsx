import React, { useState,useEffect,useMemo } from "react";
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
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.taskId === taskId
          ? {
              ...task,
              customers: task.customers.map((customer, index) =>
                index === customerIndex
                  ? { ...customer, called: !customer.called }
                  : customer
              ),
            }
          : task
      )
    );
  };

  const handleTaskToggle = (taskId) => {
    setActiveTaskId((prevActiveTaskId) =>
      prevActiveTaskId === taskId ? null : taskId
    );
  };

  return (
    <div className=" mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-5">
          Customer Dashboard Overview
        </h1>
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
