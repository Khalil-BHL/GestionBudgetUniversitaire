import { useEffect, useState } from "react";
import "./users.css";

const apiUrl = "http://localhost:5000/api/users";

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Professeur",
    department: "",
    id: null,
  });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
      department: form.department,
    };

    if (editing) {
      fetch(`${apiUrl}/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((updatedUser) => {
          setUsers(
            users.map((u) => (u.id === updatedUser.id ? updatedUser : u))
          );
          resetForm();
        });
    } else {
      fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((newUser) => {
          setUsers([...users, newUser]);
          resetForm();
        });
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      role: "Professeur",
      department: "",
      id: null,
    });
    setEditing(false);
  };

  const handleEdit = (user) => {
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      department: user.department,
      id: user.id,
    });
    setEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
      fetch(`${apiUrl}/${id}`, { method: "DELETE" }).then(() => {
        setUsers(users.filter((u) => u.id !== id));
      });
    }
  };

  return (
    <div className="container">
      <h2>Gestion des Utilisateurs</h2>

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
          className="input"
          required={!editing}
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="select"
          required
        >
          <option value="Chef Département">Chef Département</option>
          <option value="Professeur">Professeur</option>
        </select>

        <select
          name="department"
          value={form.department}
          onChange={handleChange}
          className="select"
          required
        >
          <option value="">Sélectionnez un département</option>
          <option value="Informatique">Informatique</option>
          <option value="Mathématiques">Mathématiques</option>
          <option value="Physique">Physique</option>
          <option value="Chimie">Chimie</option>
        </select>

        <div className="buttonsGroup">
          <button type="submit" className="btn btn-primary">
            {editing ? "Modifier" : "Ajouter"}
          </button>
          {editing && (
            <button
              onClick={resetForm}
              type="button"
              className="btn btn-secondary"
            >
              Annuler
            </button>
          )}
        </div>
      </form>

      <ul className="usersList">
        {users.map((user) => (
          <li
            key={user.id}
            className="userItem"
            style={{
              backgroundColor:
                user.role === "Chef Département" ? "#E0F7FA" : "#F1F8E9",
            }}
          >
            <div>
              <strong>{user.name}</strong> — {user.email} — <em>{user.role}</em>{" "}
              — {user.department}
            </div>
            <div>
              <button onClick={() => handleEdit(user)} className="btn btn-edit">
                Modifier
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                className="btn btn-delete"
              >
                Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
