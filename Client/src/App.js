import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Login from "./LoginPage/login";
// Comptable components
import ComptableDashboard from "./ComptableInterface/DashboardPage/Dashboard";
import ComptableLayout from "./ComptableInterface/Layout";
import NotificationSend from "./ComptableInterface/NotificationSendPage/NotificationSend";

// Chef Departement components
import ChefDepartementDashboard from "./ChefDepartementInterface/DashboardPage/Dashboard";
import ChefDepartementLayout from "./ChefDepartementInterface/Layout";
import ChefNotifications from "./ChefDepartementInterface/Notifications/Notifications";
import ChefRequestPage from "./ChefDepartementInterface/RequestPage/RequestPage";
import RequestsList from "./ChefDepartementInterface/RequestsListPage/RequestsList";

// Professor components
import ProfDashboard from "./ProfInterface/DashboardPage/dashboard";
import ProfLayout from "./ProfInterface/Layout";
import ProfNotifications from "./ProfInterface/Notifications/Notifications";
import RequestPage from "./ProfInterface/RequestPage/RequestPage";

// Admin components
import AdminLayout from "./AdminInterface/layout";
import AdminDashboard from "./AdminInterface/DashboardPage/dashboard";
import UserManagement from "./AdminInterface/UsermanagementPage/users";

const DirectionDashboard = () => (
  <div>Direction Dashboard (To be implemented)</div>
);
const DirectionLayout = ({ children }) => (
  <div className="dashboard-container">{children}</div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* Professor routes */}
        <Route path="/professor" element={<ProfLayout />}>
          <Route path="dashboard" element={<ProfDashboard />} />
          <Route path="request" element={<RequestPage />} />
          <Route path="notifications" element={<ProfNotifications />} />
        </Route>

        {/* Comptable routes */}
        <Route path="/comptable" element={<ComptableLayout />}>
          <Route path="dashboard" element={<ComptableDashboard />} />
          <Route path="notifications" element={<NotificationSend />} />
        </Route>

        {/* Direction routes */}
        <Route path="/direction" element={<DirectionLayout />}>
          <Route path="dashboard" element={<DirectionDashboard />} />
        </Route>

        {/* Chef Departement routes */}
        <Route path="/chef-departement" element={<ChefDepartementLayout />}>
          <Route path="dashboard" element={<ChefDepartementDashboard />} />
          <Route path="requests" element={<RequestsList />} />
          <Route path="request/:id" element={<ChefRequestPage />} />
          <Route path="notifications" element={<ChefNotifications />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
