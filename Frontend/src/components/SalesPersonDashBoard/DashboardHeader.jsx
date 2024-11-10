import React, { useState, useEffect } from "react";
import { LogOut, User, Bell, Menu, X } from "lucide-react";
import TaskNotification from "./TaskNotification";
import { useDispatch, useSelector } from "react-redux";
import { fetchRepresentativeTasks } from "../../services/operations/representativeServices";

const DashboardHeader = ({
  title = "Dashboard",
  titleColor,
  showNotifications = true,
  onLogout,
  customActions,
  logoComponent,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dispatch = useDispatch();
  const {
    assignedTasks: tasks,
    loading,
    error,
  } = useSelector((state) => state.representatives);

  // Get authentication state from Redux
  const { user } = useSelector((state) => state.auth);
  const token = useSelector((state) => state.auth.token);
  console.log("user:", user);
  const RepresentativeEmail = user.username;

  useEffect(() => {
    if (token && user) {
      dispatch(fetchRepresentativeTasks(token, user));
    }
  }, [dispatch, token, user]);

  console.log("tasksform header:", tasks);

  // Helper function to get user's initials for avatar
  const getUserInitials = () => {
    if (!user?.username) return "?";
    return user.username
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Helper function to format display name
  const getDisplayName = () => {
    if (!user?.username) return "Guest";
    return user.username.length > 20
      ? `${user.username.slice(0, 20)}...`
      : user.username;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 w-full">
      <div className="max-w-full ">
        <div className="flex justify-between items-center px-4 py-3">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            {logoComponent || (
              <h1 className={`text-2xl font-bold ${titleColor}`}>{title}</h1>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Custom Actions */}
            {customActions}

            {/* Notification Bell */}
            {showNotifications && (
              <TaskNotification
                assignedTasks={tasks}
                representativeEmail={RepresentativeEmail}
              />
            )}

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                aria-expanded={isProfileOpen}
                aria-haspopup="true"
              >
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.username}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-medium text-purple-600">
                      {getUserInitials()}
                    </span>
                  )}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-700">
                    {getDisplayName()}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user?.role || "User"}
                  </p>
                </div>
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                  role="menu"
                  aria-orientation="vertical"
                >
                  <div className="py-1">
                    {user?.email && (
                      <div className="px-4 py-2 text-xs text-gray-500">
                        {user.email}
                      </div>
                    )}
                    <button
                      onClick={onLogout}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                      role="menuitem"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <div className="flex items-center space-x-3 p-3">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.username}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-medium text-purple-600">
                      {getUserInitials()}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {getDisplayName()}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user?.role || "User"}
                  </p>
                  {user?.email && (
                    <p className="text-xs text-gray-500">{user.email}</p>
                  )}
                </div>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
