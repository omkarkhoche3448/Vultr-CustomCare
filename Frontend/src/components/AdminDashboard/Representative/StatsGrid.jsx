import React, { useMemo, useEffect, useState } from "react";
import {  useSelector } from "react-redux";
import { Users, AlertCircle } from "lucide-react";
import axios from "axios";

const STATS_CONFIG = [
  {
    id: "representatives",
    title: "Total Representatives",
    icon: Users,
    gradient: "bg-green-100",
    textColor: "text-green-600",
    getValue: (tasks) =>
      new Set(
        tasks.flatMap(
          (task) => task?.assignedMembers?.map((rep) => rep?.name) || []
        )
      ).size,
  },
  {
    id: "pending",
    title: "Pending Tasks",
    icon: AlertCircle,
    gradient: "bg-yellow-100",
    textColor: "text-yellow-600",
    getValue: (tasks) =>
      tasks.filter((task) => task?.status === "PENDING").length,
  },
  {
    id: "highPriority",
    title: "High Priority Tasks",
    icon: AlertCircle,
    gradient: "bg-red-100",
    textColor: "text-red-600",
    getValue: (tasks) =>
      tasks.filter((task) => task?.priority === "High").length,
  },
];

const taskService = {
  async fetchTasks(token) {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/admin/tasks",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data; // Assuming this is an array of tasks
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch tasks");
    }
  },
};

const StatCard = ({ stat, value }) => (
  <div className="relative overflow-hidden bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
    <div className={`absolute inset-0 ${stat.gradient} opacity-50`} />
    <div className="relative flex items-start justify-between">
      <div className="space-y-3">
        <div
          className={`${stat.textColor} bg-white rounded-lg p-2 inline-flex items-center justify-center shadow-sm`}
        >
          <stat.icon className="w-5 h-5" strokeWidth={2} />
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-gray-800">
              {value}
            </span>
          </div>
          <p className="text-sm font-medium text-gray-500 mt-1">{stat.title}</p>
        </div>
      </div>
    </div>
  </div>
);

const StatsGrid = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {token} =useSelector((state) => state.auth);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await taskService.fetchTasks(token);
        setTasks(data);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      loadTasks();
    }
  }, [token]);

  const statsData = useMemo(() => {
    return STATS_CONFIG.map((stat) => ({
      ...stat,
      value: Array.isArray(tasks) ? stat.getValue(tasks) : 0,
    }));
  }, [tasks]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {statsData.map((stat) => (
        <StatCard key={stat.id} stat={stat} value={stat.value} />
      ))}
    </div>
  );
};

export default StatsGrid;
