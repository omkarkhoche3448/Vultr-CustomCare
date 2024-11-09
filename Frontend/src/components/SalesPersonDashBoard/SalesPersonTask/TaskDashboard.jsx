import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../../../services/operations/adminServices";
import { formatDistance } from "date-fns";
import { LoaderCircle } from "lucide-react";
import { User } from "lucide-react";

const StatusBadge = ({ status = "" }) => {
  const statusColors = {
    COMPLETED: "bg-green-100 text-green-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    IN_PROGRESS: "bg-blue-100 text-blue-800",
  };

  const formattedStatus = status ? status.replace("_", " ") : "Unknown Status";

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        statusColors[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {formattedStatus}
    </span>
  );
};

const TaskDashboard = () => {
  const dispatch = useDispatch();
  const [statusFilter, setStatusFilter] = useState("ALL");

  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const tasks = useSelector((state) => state.task.tasks);
  const loading = useSelector((state) => state.task.loading);
  const error = useSelector((state) => state.task.error);

  useEffect(() => {
    if (token) {
      dispatch(fetchTasks(token));
    }
  }, [dispatch, token]);
  console.log("all tasks ", tasks[0]);

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const filteredTasks =
    Array.isArray(tasks) && statusFilter === "ALL"
      ? tasks
      : Array.isArray(tasks)
      ? tasks.filter((task) => task.status === statusFilter)
      : [];

  function TimeAgo({ createdAt }) {
    const [timeAgoText, setTimeAgoText] = useState("");

    // Function to calculate time ago
    const calculateTimeAgo = () => {
      const currentTime = new Date();
      const pastTime = new Date(createdAt);
      const differenceInMs = currentTime - pastTime;

      const differenceInSeconds = Math.floor(differenceInMs / 1000);
      const differenceInMinutes = Math.floor(differenceInSeconds / 60);
      const differenceInHours = Math.floor(differenceInMinutes / 60);
      const remainingMinutes = differenceInMinutes % 60;
      const remainingSeconds = differenceInSeconds % 60;

      let timeString = "";
      if (differenceInHours > 0) {
        timeString = `${differenceInHours} hrs ${remainingMinutes} min ${remainingSeconds} sec ago`;
      } else if (differenceInMinutes > 0) {
        timeString = `${remainingMinutes} min ${remainingSeconds} sec ago`;
      } else {
        timeString = `${remainingSeconds} sec ago`;
      }

      setTimeAgoText(timeString);
    };

    useEffect(() => {
      // Set initial time ago
      calculateTimeAgo();

      // Update time every second
      const intervalId = setInterval(calculateTimeAgo, 1000);

      // Cleanup interval on component unmount
      return () => clearInterval(intervalId);
    }, [createdAt]); // Re-run when createdAt changes

    return <span>{timeAgoText}</span>;
  }

  console.log("filteredTasks", filteredTasks);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mx-auto">
        <DashboardHeader user={user} />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <select
            className="w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={handleStatusChange}
          >
            <option value="ALL">All Tasks</option>
            <option value="COMPLETED">Completed</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
          </select>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500" />
          </div>
        )}

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            {error}
          </div>
        )}

        {!loading && (
          <div className="w-full">
            {filteredTasks.length === 0 ? (
              <div className="flex justify-center items-center h-full w-full py-8 mx-auto text-purple-600">
                <LoaderCircle className="w-8 h-8  animate-spin" />{" "}
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <div className="min-w-[1000px]">
                  {" "}
                  {/* Minimum width to prevent squishing */}
                  {/* Header */}
                  <div className="grid grid-cols-5 bg-gray-100 gap-4 p-4 font-medium">
                    <div className="text-sm font-medium text-gray-900">
                      Project
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      Description
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      Assigned To
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      Status
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      Created
                    </div>
                  </div>
                  {/* Body */}
                  <div className="divide-y divide-gray-200 bg-white">
                    {tasks.map((task) => (
                      <div
                        key={task.taskId}
                        className="grid grid-cols-5 gap-4 p-4 hover:bg-gray-50 items-center"
                      >
                        <div className="text-sm text-gray-900 truncate">
                          {task.projectTitle}
                        </div>

                        <div className="text-sm text-gray-500 truncate">
                          {task.description}
                        </div>

                        <div className="flex space-x-4">
                          {task.assignedMembers
                            ?.slice(0, 3)
                            .map((member, index) => (
                              <div key={index} className="flex items-center">
                                <div className="h-8 w-8 rounded-full bg-purple-300 flex items-center justify-center text-white">
                                  <User size={20} />
                                </div>
                                <span className="ml-2 text-sm font-medium text-gray-900">
                                  {member.name}
                                </span>
                              </div>
                            ))}
                        </div>

                        <div>
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                              task.status.toLowerCase() === "completed"
                                ? "bg-green-100 text-green-800"
                                : task.status.toLowerCase() === "in progress"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {task.status}
                          </span>
                        </div>

                        <div className="text-sm text-gray-500 whitespace-nowrap">
                          <TimeAgo createdAt={task.createdAt} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const DashboardHeader = ({ user }) => (
  <div className="mb-6 bg-white border border-gray-200 rounded-lg">
    <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Task Dashboard Overview
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Welcome back, {user?.username}
        </p>
      </div>
      <div className="mt-4 sm:mt-0 flex items-center space-x-4">
        <div className="text-sm text-gray-600">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  </div>
);

export default TaskDashboard;
