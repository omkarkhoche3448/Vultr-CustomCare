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

const AdminHome = () => {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [deadlines, setDeadlines] = useState([]);

  useEffect(() => {
    fetchStats().then(setStats);
    fetchRecentActivity().then(setRecentActivity);
    fetchDeadlines().then(setDeadlines);
  }, []);

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
              />
              <StatCard
                title="Completed"
                value={stats.completedTasks}
                icon={CheckCircle2}
                change="+8%"
                isPositive={true}
              />
              <StatCard
                title="Pending"
                value={stats.pendingTasks}
                icon={Clock}
                change="-5%"
                isPositive={false}
              />
              <StatCard
                title="Team Members"
                value={stats.teamMembers}
                icon={Users}
                change="+2"
                isPositive={true}
              />
            </>
          )}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RecentTasks recentActivity={recentActivity} />
          <UpcomingDeadlines deadlines={deadlines} />
        </div>
      </div>
    </div>
  );
};

const DashboardHeader = () => (
  <div className="mb-6 bg-white border border-gray-200 rounded-lg">
    <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Dashboard Overview
        </h1>
        <p className="text-sm text-gray-600 mt-1">Welcome back, Admin</p>
      </div>
      <div className="mt-4 sm:mt-0 flex items-center space-x-4">
        <div className="text-sm text-gray-600">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  </div>
);

const StatCard = ({ title, value, icon: Icon, change, gradient }) => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
    <div className={`bg-gradient-to-r ${gradient} p-1`} />
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-1">{value}</h3>
          <p className="text-sm text-green-600 flex items-center mt-2">
            <ArrowUp className="w-4 h-4 mr-1" />
            {change}
          </p>
        </div>
        <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
          <Icon className="w-6 h-6 text-gray-600" />
        </div>
      </div>
    </div>
  </div>
);

const PaginationControls = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
}) => (
  <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
    <div className="text-sm text-gray-600">
      Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
      {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
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

const RecentTasks = ({ recentActivity }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(recentActivity.length / itemsPerPage);

  const paginatedData = recentActivity.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Recent Tasks</h2>
      </div>
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left pb-3 text-sm font-medium text-gray-600">
                  Task
                </th>
                <th className="text-left pb-3 text-sm font-medium text-gray-600">
                  Status
                </th>
                <th className="text-left pb-3 text-sm font-medium text-gray-600">
                  Time
                </th>
              </tr>
            </thead>
            <tbody >
              {paginatedData.map((activity) => (
                <tr
                  key={activity.id}
                  className="border-b border-gray-100 last:border-0"
                >
                  <td className="py-4">
                    <p className="font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-500">{activity.project}</p>
                  </td>
                  <td className="py-4">
                    <span
                      className={`px-2.5 py-1 rounded text-xs font-medium ${
                        activity.status === "completed"
                          ? "bg-green-50 text-green-700"
                          : activity.status === "pending"
                          ? "bg-yellow-50 text-yellow-700"
                          : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {activity.status}
                    </span>
                  </td>
                  <td className="py-4 text-sm text-gray-600">
                    {activity.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={recentActivity.length}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

const UpcomingDeadlines = ({ deadlines }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(deadlines.length / itemsPerPage);

  const paginatedDeadlines = deadlines.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Upcoming Deadlines
        </h2>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {paginatedDeadlines.map((deadline, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
            >
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{deadline.title}</p>
                <p className="text-sm text-gray-600">{deadline.due}</p>
              </div>
            </div>
          ))}
        </div>

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={deadlines.length}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default AdminHome;
