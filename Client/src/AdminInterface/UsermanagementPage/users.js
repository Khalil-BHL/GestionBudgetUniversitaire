import { useEffect, useState } from "react";
import "./users.css";

const apiUrl = "http://localhost:5000/api/users";

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "Professeur",
    id: null,
  });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      fetch(`${apiUrl}/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          role: form.role,
        }),
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
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          role: form.role,
        }),
      })
        .then((res) => res.json())
        .then((newUser) => {
          setUsers([...users, newUser]);
          resetForm();
        });
    }
  };

  const resetForm = () => {
    setForm({ name: "", email: "", role: "Professeur", id: null });
    setEditing(false);
  };

  const handleEdit = (user) => {
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      id: user.id,
    });
    setEditing(true);
  };

  const handleDelete = (id) => {
    fetch(`${apiUrl}/${id}`, { method: "DELETE" }).then(() => {
      setUsers(users.filter((u) => u.id !== id));
    });
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
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="select"
        >
          <option value="Chef Département">Chef Département</option>
          <option value="Professeur">Professeur</option>
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
          <li key={user.id} className="userItem">
            <div>
              <strong>{user.name}</strong> — {user.email} — <em>{user.role}</em>
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
