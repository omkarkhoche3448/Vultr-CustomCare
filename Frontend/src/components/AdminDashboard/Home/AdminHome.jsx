import React, { useEffect, useState } from "react";
import {
  Users,
  BarChart3,
  Clock,
  CheckCircle2,
  ArrowUp,
  Calendar,
} from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  fetchStats,
  fetchRecentActivity,
  fetchDeadlines,
} from "../../../services/operations/adminServices";

import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../../../services/operations/adminServices";
import DashboardHeader from "./DashboardHeader";
import StatCard from "./StatCard";
import RecentTasks from "./RecentTasks";
import Loader from "../Loader";

const AdminHome = () => {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const dispatch = useDispatch();
  const [recentTasks, setRecentTasks] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const tasks = await dispatch(fetchTasks(token));
        setRecentTasks(tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    if (token) {
      loadTasks();
    }
  }, [token, dispatch]);

  // console.log("recentTasks:", recentTasks);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsData = await fetchStats();
        setStats(statsData);

        const sortedActivities = [...recentTasks].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        // console.log("sortedActivities:", sortedActivities);
        setRecentActivity(sortedActivities);

        const deadlinesData = await fetchDeadlines();
        setDeadlines(deadlinesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (recentTasks.length > 0) {
      fetchData();
    }
  }, [recentTasks]);
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <DashboardHeader />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats && (
            <>
              <StatCard
                title="Total Tasks"
                value={stats.totalTasks}
                icon={BarChart3}
                change="+12%"
                isPositive={true}
                gradient="from-blue-500 to-blue-600"
              />
              <StatCard
                title="Completed"
                value={stats.completedTasks}
                icon={CheckCircle2}
                change="+0%"
                isPositive={true}
                gradient="from-green-500 to-green-600"
              />
              <StatCard
                title="Pending"
                value={stats.pendingTasks}
                icon={Clock}
                change="-5%"
                isPositive={false}
                gradient="from-yellow-500 to-yellow-600"
              />
              <StatCard
                title="Team Members"
                value={stats.teamMembers}
                icon={Users}
                change="+2"
                isPositive={true}
                gradient="from-purple-500 to-purple-600"
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6">
          {recentActivity.length === 0 ? (
            <Loader />
          ) : (
            <RecentTasks recentActivity={recentActivity} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
