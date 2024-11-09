import React, { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";

const TaskNotification = ({ assignedTasks, representativeEmail }) => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [expandedTask, setExpandedTask] = useState(null);
  const notificationRef = useRef(null);
  const processedTaskIds = useRef(new Set());

  // Process new tasks and create notifications
  useEffect(() => {
    if (!assignedTasks || !Array.isArray(assignedTasks)) {
      return;
    }

    // Filter new tasks
    const newTasks = assignedTasks.filter((task) => {
      const isNewTask = !processedTaskIds.current.has(task.taskId);
      const isAssignedToMe = task.assignedMembers?.some(
        (member) => member.name === representativeEmail
      );
      return isNewTask && isAssignedToMe;
    });

    if (newTasks.length > 0) {
      const newNotifications = newTasks.map((task) => {
        // Mark task as processed
        processedTaskIds.current.add(task.taskId);

        return {
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
        };
      });

      setNotifications((prev) => [...newNotifications, ...prev]);
      setHasUnread(true);

      // Optional: Show browser notification
      if (Notification.permission === "granted") {
        newNotifications.forEach((notification) => {
          new Notification("New Task Assigned", {
            body: `New ${notification.category} task: ${notification.projectTitle}`,
          });
        });
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
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  // Priority styles mapping
  const priorityStyles = {
    high: "text-red-600 bg-red-50",
    medium: "text-yellow-600 bg-yellow-50",
    normal: "text-blue-600 bg-blue-50",
    low: "text-green-600 bg-green-50",
  };

  const statusStyles = {
    PENDING: "bg-yellow-100 text-yellow-800",
    IN_PROGRESS: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

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
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            priorityStyles[notification.priority.toLowerCase()]
                          }`}
                        >
                          {notification.priority}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            statusStyles[notification.status]
                          }`}
                        >
                          {notification.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          {notification.category.toUpperCase()}
                        </span>
                      </div>

                      <h3 className="text-sm font-medium text-gray-800">
                        {notification.projectTitle}
                      </h3>

                      <p className="text-xs text-gray-500 mt-1">
                        Due: {formatDate(notification.dueDate)}
                      </p>

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
