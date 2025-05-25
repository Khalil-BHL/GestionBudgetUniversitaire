import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import Login from "./LoginPage/login";

// Direction components
import DirectionDashboard from "./DirectionInterface/DashboardPage/dashboard";
import DirectionLayout from "./DirectionInterface/Layout";
import DirectionNotifications from "./DirectionInterface/NotificationPage/Notifications";
import { NotificationProvider as DirectionNotificationProvider } from "./DirectionInterface/NotificationPage/NotificationContext";

// Comptable components
import ComptableDashboard from "./ComptableInterface/DashboardPage/Dashboard";
import ComptableLayout from "./ComptableInterface/Layout";
import NotificationSend from "./ComptableInterface/NotificationSendPage/NotificationSend";

// Chef Departement components
import ChefDepartementDashboard from "./ChefDepartementInterface/DashboardPage/Dashboard";
import ChefDepartementLayout from "./ChefDepartementInterface/Layout";
import RequestsList from "./ChefDepartementInterface/RequestsListPage/RequestsList";
import ChefRequestPage from "./ChefDepartementInterface/RequestPage/RequestPage";
import ChefNotifications from "./ChefDepartementInterface/Notifications/Notifications";
import { NotificationProvider as ChefNotificationProvider } from "./ChefDepartementInterface/Notifications/NotificationContext";


// Professor components
import ProfDashboard from "./ProfInterface/DashboardPage/dashboard";
import ProfLayout from "./ProfInterface/Layout";
import RequestPage from "./ProfInterface/RequestPage/RequestPage";
import ProfNotifications from "./ProfInterface/Notifications/Notifications";
import StatisticsPage from "./ProfInterface/Statistics/StatisticsPage";
import { NotificationProvider } from "./ProfInterface/Notifications/NotificationContext";

// Admin components
import AdminLayout from "./AdminInterface/layout";
import AdminDashboard from "./AdminInterface/DashboardPage/dashboard";
import UserManagement from "./AdminInterface/UsermanagementPage/users";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Professor routes */}
        <Route path="/professor" element={
          <NotificationProvider>
            <ProfLayout />
          </NotificationProvider>
        }>
          <Route path="dashboard" element={<ProfDashboard />} />
          <Route path="request" element={<RequestPage />} />
          <Route path="notifications" element={<ProfNotifications />} />
          <Route path="statistics" element={<StatisticsPage />} />
        </Route>

        {/* Comptable routes */}
        <Route path="/comptable" element={<ComptableLayout />}>
          <Route path="dashboard" element={<ComptableDashboard />} />
          <Route path="notifications" element={<NotificationSend />} />
        </Route>

        {/* Direction routes */}
        <Route path="/direction" element={
          <DirectionNotificationProvider>
            <DirectionLayout />
          </DirectionNotificationProvider>
        }>
          <Route path="dashboard" element={<DirectionDashboard />} />
          <Route path="notifications" element={<DirectionNotifications />} />
        </Route>

        {/* Chef Departement routes */}
        <Route path="/chef-departement" element={
          <ChefNotificationProvider>
            <ChefDepartementLayout />
          </ChefNotificationProvider>
        }>
          <Route path="dashboard" element={<ChefDepartementDashboard />} />
          <Route path="requests" element={<RequestsList />} />
          <Route path="request/:id" element={<ChefRequestPage />} />
          <Route path="notifications" element={<ChefNotifications />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
