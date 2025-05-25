import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#a4de6c", "#d0ed57", "#8dd1e1"];

const UsersPerDepartmentPie = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/statistics/users-per-department")
      .then(response => setData(response.data))
      .catch(error => console.error("Erreur lors du chargement des données utilisateurs", error));
  }, []);

  return (
    <div style={{ width: "100%", height: 400, background: "#ffffff", borderRadius: "16px", padding: "30px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}>
      <h2 style={{ textAlign: "center", marginBottom: "10px" }}>Utilisateurs par département</h2>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={data}
            dataKey="user_count"
            nameKey="department"
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UsersPerDepartmentPie;
