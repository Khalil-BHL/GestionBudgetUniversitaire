import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";

const StatistiquesDemandes = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/statistics/purchase-request-status")
      .then(response => setData(response.data))
      .catch(error => console.error("Erreur lors du chargement des statistiques", error));
  }, []);

  return (
    <div style={{ width: "100%", height: 400, background: "#ffffff", borderRadius: "16px", padding: "20px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Analyse des demandes d'achat par statut</h2>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 30, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 'dataMax']} tickCount={10} allowDecimals={false}/>
          <YAxis dataKey="statut" type="category" />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#7e57c2" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatistiquesDemandes; 