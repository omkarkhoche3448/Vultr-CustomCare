import { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation, useParams } from "react-router-dom";
import SalespersonSidebar from "./SalespersonSidebar";
import CallList from "./Calling/CallList";
import TaskDashboard from "./SalesPersonTask/TaskDashboard";
import DashboardHeader from './DashboardHeader';
import {logout} from  "../../services/operations/authServices"


const UsersContent = () => (
  <div>
    <h2>Users Management</h2>
  </div>
);

const ClockContent = () => (
  <div>
    <h2>Schedule Management</h2>
  </div>
);

// Define routes and their corresponding components and IDs
const routeConfig = {
  tasks: { id: 1, component: TaskDashboard },
  calls: { id: 2, component: CallList },
  schedule: { id: 3, component: ClockContent },
  users: { id: 4, component: UsersContent },
};

// Reverse mapping for getting route from ID
const idToRoute = {
  1: "tasks",
  2: "calls",
  3: "schedule",
  4: "users",
};

export default function SalespersonDashboard() {
  document.title = "DynamicDialers | Dashboard";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useParams(); // Accessing user ID from URL parameters

  // Initialize selected icon based on current route
  const getInitialIcon = () => {
    const path = location.pathname.split("/").pop();
    return routeConfig[path]?.id || 1; // Default to tasks if no route match
  };

  const [selectedIcon, setSelectedIcon] = useState(getInitialIcon());

  // Update URL when icon changes
  useEffect(() => {
    const route = idToRoute[selectedIcon];
    if (route) {
      navigate(`/dashboard/${route}`, { replace: true });
    }
  }, [selectedIcon, navigate, userId]);

  // Update selected icon when URL changes directly (e.g., on refresh)
  useEffect(() => {
    const path = location.pathname.split("/").pop();
    const matchedRoute = routeConfig[path];
    if (matchedRoute) {
      setSelectedIcon(matchedRoute.id);
    }
  }, [location]);

  const handleIconClick = (id) => {
    setSelectedIcon(id);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/signin');
  };

  const CurrentContent =
    routeConfig[idToRoute[selectedIcon]]?.component || TaskDashboard;

  return (
    <div className="flex min-h-screen max-h-screen flex-col lg:flex-row bg-gray-100">
      <SalespersonSidebar
        selectedIcon={selectedIcon}
        onIconClick={handleIconClick}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">

        <DashboardHeader
          title="DynamicDialers"
          titleColor={"text-purple-600"}
          onLogout={handleLogout}
          showNotifications={true}
        />

        <main className="flex-1 lg:p-6 overflow-auto">
          <CurrentContent />
        </main>
      </div>
    </div>
  );
}
