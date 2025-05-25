import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";

const ApprovedByTypeMarcheCard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/statistics/approved-by-type-marche")
      .then(response => setData(response.data))
      .catch(error => console.error("Erreur lors du chargement des statistiques", error));
  }, []);

  return (
    <div style={{ width: "100%", height: 400, background: "#ffffff", borderRadius: "16px", padding: "20px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Demandes approuvées par type de marché</h2>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data} margin={{ top: 10, right: 30, left: 30, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="type_marche" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#4CAF50" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ApprovedByTypeMarcheCard; 