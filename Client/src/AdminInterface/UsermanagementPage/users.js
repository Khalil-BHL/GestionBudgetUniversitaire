import { useEffect, useState } from "react";
import "./users.css";

const apiUrl = "http://localhost:5000/api/users";

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role_id: "",
    department: "",
  });

  // Roles that don't require departments
  const nonDepartmentRoles = ["Admin", "Direction", "Comptable"];

  useEffect(() => {
    // Fetch departments and roles when component mounts
    fetchDepartments();
    fetchRoles();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/departments");
      if (!response.ok) throw new Error('Failed to fetch departments');
      const data = await response.json();
      setDepartments(data);
    } catch (err) {
      console.error("Error fetching departments:", err);
      setError("Erreur lors du chargement des départements");
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/roles");
      if (!response.ok) throw new Error('Failed to fetch roles');
      const data = await response.json();
      setRoles(data);
      // Set default role if available
      if (data.length > 0) {
        setForm(prev => ({ ...prev, role_id: data[0].id }));
      }
    } catch (err) {
      console.error("Error fetching roles:", err);
      setError("Erreur lors du chargement des rôles");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => {
      const newForm = { ...prev, [name]: value };
      
      // If role changes, check if department should be cleared
      if (name === 'role_id') {
        const selectedRole = roles.find(r => r.id === parseInt(value));
        if (selectedRole && nonDepartmentRoles.includes(selectedRole.name)) {
          newForm.department = "";
        }
      }
      
      return newForm;
    });
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const selectedRole = roles.find(r => r.id === parseInt(form.role_id));
    const requiresDepartment = selectedRole && !nonDepartmentRoles.includes(selectedRole.name);

    // Validate department only if role requires it
    if (requiresDepartment && !form.department) {
      setError("Le département est requis pour ce rôle");
      setLoading(false);
      return;
    }

    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      role_id: form.role_id,
      department: requiresDepartment ? form.department : null,
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) throw new Error('Failed to create user');
      
      showSuccessMessage("Utilisateur créé avec succès!");
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      role_id: roles.length > 0 ? roles[0].id : "",
      department: "",
    });
  };

  const selectedRole = roles.find(r => r.id === parseInt(form.role_id));
  const showDepartment = selectedRole && !nonDepartmentRoles.includes(selectedRole.name);

  return (
    <div className="container">
      <h2>Ajouter un Nouvel Utilisateur</h2>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <form onSubmit={handleSubmit} className="form">
        <input
          name="name"
          placeholder="Nom"
          value={form.name}
          onChange={handleChange}
          required
          className="input"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="input"
        />
        <input
          name="password"
          type="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={handleChange}
          required
          className="input"
        />
        <select
          name="role_id"
          value={form.role_id}
          onChange={handleChange}
          className="select"
          required
        >
          <option value="">Sélectionnez un rôle</option>
          {roles.map(role => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>

        {showDepartment && (
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            className="select"
            required
          >
            <option value="">Sélectionnez un département</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </select>
        )}

        <div className="buttonsGroup">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Chargement..." : "Ajouter"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
