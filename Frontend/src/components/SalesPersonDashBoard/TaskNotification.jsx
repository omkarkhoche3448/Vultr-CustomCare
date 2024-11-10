import React, { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";


const TaskNotification = ({ assignedTasks, representativeEmail }) => {

  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [expandedTask, setExpandedTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const notificationRef = useRef(null);
  const processedTaskIds = useRef(new Set());

  // Add browser notification permission check
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
    setIsLoading(false);
  }, []);

  // Process new tasks and create notifications
  useEffect(() => {
    if (!assignedTasks || !Array.isArray(assignedTasks)) {
      return;
    }

    // Sort tasks by assigned date (newest first)
    const sortedTasks = [...assignedTasks].sort(
      (a, b) => new Date(b.assignedDate) - new Date(a.assignedDate)
    );
    console.log("sortedTasks:", sortedTasks);

    // Filter new tasks assigned to current user
    const newTasks = sortedTasks
      .filter((task) => {
        const isNewTask = !processedTaskIds.current.has(task.taskId);
        const isAssignedToMe = task.assignedMembers?.some(
          (member) => member.name === representativeEmail
        );
        console.log("isNewTask:", isNewTask);
        console.log("isAssignedToMe:", isAssignedToMe);
        // Check if task was assigned within last 24 hours
        const isRecent =
          new Date(task.assignedDate) >
          new Date(Date.now() - 24 * 60 * 60 * 1000);
        return isNewTask && isAssignedToMe && isRecent;
      })
      .slice(0, 5); // Limit to 5 most recent notifications

      console.log("newTasks:", newTasks);

    if (newTasks.length > 0) {
      // Create notifications for new tasks
      const newNotifications = newTasks.map((task) => ({
        id: task.taskId,
        projectTitle: task.projectTitle,
        description: task.description,
        priority: task.priority?.toLowerCase() || "normal",
        status: task.status,
        category: task.category,
        customers: task.customers,
        keywords: task.keywords,
        assignedDate: task.assignedDate,
        dueDate: task.dueDate,
        isRead: false,
      }));

      // Add new notifications and limit total to 10
      setNotifications((prev) => [...newNotifications, ...prev].slice(0, 10));

      // Mark tasks as processed
      newTasks.forEach((task) => processedTaskIds.current.add(task.taskId));

      setHasUnread(true);

      // Show browser notifications
      if (Notification.permission === "granted") {
        try {
          newTasks.forEach((task) => {
            new Notification("New Task Assigned", {
              body: `${task.projectTitle} - Due: ${formatDate(task.dueDate)}`,
              icon: "/notification-icon.png", // Add your icon path
            });
          });
        } catch (error) {
          console.error("Error showing browser notification:", error);
        }
      }
    }
  }, [assignedTasks, representativeEmail]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setExpandedTask(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cleanup old notifications
  useEffect(() => {
    const cleanup = setInterval(() => {
      setNotifications((prev) =>
        prev.filter(
          (notification) =>
            new Date(notification.assignedDate) >
            new Date(Date.now() - 24 * 60 * 60 * 1000)
        )
      );
    }, 60 * 60 * 1000); // Check every hour

    return () => clearInterval(cleanup);
  }, []);

  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
    updateUnreadStatus();
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true }))
    );
    setHasUnread(false);
  };

  const deleteNotification = (notificationId) => {
    setNotifications((prev) =>
      prev.filter((notif) => notif.id !== notificationId)
    );
    updateUnreadStatus();
  };

  const updateUnreadStatus = () => {
    const hasUnreadNotifications = notifications.some((notif) => !notif.isRead);
    setHasUnread(hasUnreadNotifications);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) throw new Error("Invalid date");
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Date parsing error:", error);
      return "Invalid date";
    }
  };

  // Priority styles mapping
  const priorityStyles = {
    high: "text-red-600 ",
    medium: "text-yellow-600 ",
    low: "text-green-600 ",
  };

  const statusStyles = {
    PENDING: " text-yellow-800",
    IN_PROGRESS: " text-blue-800",
    COMPLETED: " text-green-800",
    CANCELLED: " text-red-800",
  };

  if (isLoading) {
    return (
      <div className="relative">
        <Bell className="h-6 w-6 text-gray-400 animate-pulse" />
      </div>
    );
  }

  return (
    <div ref={notificationRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
      >
        <Bell className="h-6 w-6 text-gray-600" />
        {hasUnread && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="flex items-center justify-between p-3 border-b border-gray-200">
            <span className="font-medium text-gray-700">
              Task Notifications
            </span>
            {notifications.length > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[32rem] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${
                    notification.isRead ? "bg-white" : "bg-blue-50"
                  }`}
                >
                  <div className="flex justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-800">
                        {notification.projectTitle}
                      </h3>

                      <p className="text-xs text-gray-500 mt-1">
                        Due: {formatDate(notification.dueDate)}
                      </p>

                      <div className="flex items-center gap-2 mb-2 mt-1">
                        <span
                          className={`text-xs rounded-full ${
                            priorityStyles[notification.priority.toLowerCase()]
                          }`}
                        >
                          {notification.priority}
                        </span>
                        <span
                          className={`text-xs rounded-full ${
                            statusStyles[notification.status]
                          }`}
                        >
                          {notification.status.toLowerCase()}
                        </span>
                        <span className="text-xs text-gray-500">
                          {notification.category.toLowerCase()}
                        </span>
                      </div>

                      {expandedTask === notification.id && (
                        <div className="mt-3 space-y-2">
                          <p className="text-sm text-gray-600">
                            {notification.description}
                          </p>

                          <div className="mt-2">
                            <h4 className="text-xs font-medium text-gray-700 mb-1">
                              Customers ({notification.customers.length}):
                            </h4>
                            <div className="space-y-1">
                              {notification.customers
                                .slice(0, 3)
                                .map((customer, index) => (
                                  <div
                                    key={index}
                                    className="text-xs text-gray-600"
                                  >
                                    {customer.name} - {customer.productDemand}
                                  </div>
                                ))}
                              {notification.customers.length > 3 && (
                                <div className="text-xs text-blue-600">
                                  +{notification.customers.length - 3} more
                                  customers
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1 mt-2">
                            {notification.keywords.map((keyword, index) => (
                              <span
                                key={index}
                                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ×
                      </button>

                      <button
                        onClick={() => {
                          if (!notification.isRead) markAsRead(notification.id);
                          setExpandedTask(
                            expandedTask === notification.id
                              ? null
                              : notification.id
                          );
                        }}
                        className="text-xs text-blue-600 hover:text-blue-700"
                      >
                        {expandedTask === notification.id
                          ? "Show less"
                          : "Show more"}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskNotification;
