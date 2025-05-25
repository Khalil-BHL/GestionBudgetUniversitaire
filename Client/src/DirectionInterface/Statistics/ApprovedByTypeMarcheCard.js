import React, { useEffect, useState } from "react";
import axios from "axios";


const colors = ["#42a5f5", "#26c6da", "#ffee58", "#ec407a", "#66bb6a", "#ab47bc"];

const ApprovedByTypeMarcheCard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/statistics/approved-by-type-marche")
      .then(response => setData(response.data))
      .catch(error => console.error("Error loading approved by type_marche", error));
  }, []);

  return (
    <div style={{
      background: "#fff",
      borderRadius: "16px",
      padding: "20px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      maxWidth: "400px",
      margin: "auto"
    }}>
      <h3 style={{ marginBottom: "16px", fontWeight: "bold" }}>Commandes Approuvées</h3>
      {data.map((item, index) => (
        <div key={item.type_marche} style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "10px"
        }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: colors[index % colors.length],
              marginRight: "10px"
            }}></div>
            <span>{item.type_marche}</span>
          </div>
          <span style={{ fontWeight: "bold" }}>{item.count}</span>
        </div>
      ))}
    </div>
  );
};

export default ApprovedByTypeMarcheCard;
