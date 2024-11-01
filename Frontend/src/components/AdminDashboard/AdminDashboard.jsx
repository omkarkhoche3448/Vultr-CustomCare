import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useDispatch } from "react-redux"; 
import DashboardHeader from "../SalesPersonDashBoard/DashboardHeader";
import AdminSidebar from "./AdminSidebar";
import TaskDashboard from "./Task/TaskDashBoard";
import RepresentativesDashboard from "./Representative/RepresentativesDashboard";
import CustomerDashboard from "./Customer/CustomerDashboard";
import { logout } from "../../services/operations/authServices";
import { fetchRepresentatives, fetchCustomers, fetchTasks, } from "../../services/operations/adminServices";
import AdminHome  from "./home/AdminHome";


const routeConfig = {
  home: { id: 1, component: () => <AdminHome/> },
  tasks: {
    id: 2,
    component: () => (
      <TaskDashboard />
    ),
  },
  representatives: {
    id: 3,
    component: () => <RepresentativesDashboard representatives={[]} />,
  },
  customers: { id: 4, component: () => <CustomerDashboard customers={[]} /> },
};

const idToRoute = {
  1: "home",
  2: "tasks",
  3: "representatives",
  4: "customers",
};

 function AdminDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { adminId } = useParams();

  const getInitialIcon = () => {
    const path = location.pathname.split("/").pop();
    return routeConfig[path]?.id || 1;
  };

  const [selectedIcon, setSelectedIcon] = useState(getInitialIcon());

  useEffect(() => {
    const route = idToRoute[selectedIcon];
    if (route) {
      navigate(`/admin-dashboard/${route}`, { replace: true });
    }
  }, [selectedIcon, navigate, adminId]);

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
    navigate("/signin");
  };

  const CurrentContent =
    routeConfig[idToRoute[selectedIcon]]?.component ||
    routeConfig.home.component;

  useEffect(() => {
    document.title = `DynamicDialers | ${
      CurrentContent.name || "Admin Dashboard"
    }`;
  }, [CurrentContent]);

  return (
    <div className="flex min-h-screen max-h-screen flex-col lg:flex-row bg-gray-100">
      <AdminSidebar selectedIcon={selectedIcon} onIconClick={handleIconClick} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <DashboardHeader
          title="DynamicDialers Admin Dashboard"
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
export default AdminDashboard;