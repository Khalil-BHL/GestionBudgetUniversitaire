import React from 'react';
import StatistiquesDemandes from './StatistiquesDemandes';
import ApprovedByTypeMarcheCard from "./ApprovedByTypeMarcheCard";
import UsersPerDepartmentPie from "./UsersPerDepartmentPie";

const StatisticsPage = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "40px", padding: "40px" }}>
      <StatistiquesDemandes />
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <div style={{ flex: 1 }}>
          <ApprovedByTypeMarcheCard />
        </div>
        <div style={{ flex: 1 }}>
          <UsersPerDepartmentPie />
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage; 