// src/pages/AdminPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    fetch('/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Non autorisé ou erreur serveur');
        return res.json();
      })
      .then((data) => setUsers(data))
      .catch((err) => setError(err.message));
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Panel Administrateur</h1>
      {error && <p className="text-red-600">{error}</p>}
      <table className="w-full bg-white rounded shadow p-4">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Nom d'utilisateur</th>
            <th className="p-2 text-left">Rôle</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-b">
              <td className="p-2">{user.username}</td>
              <td className="p-2">{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
