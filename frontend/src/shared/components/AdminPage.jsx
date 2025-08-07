// src/pages/AdminPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { handleApiError } from '../../api/axios';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await api.get('/auth/users');
        setUsers(response.data.users || response.data);
        setError(null);
      } catch (err) {
        const errorInfo = handleApiError(err);
        setError(errorInfo.message);
        if (errorInfo.status === 401) {
          navigate('/auth/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Panel Administrateur</h1>
      {error && <p className="text-red-600">{error}</p>}
      {loading && <p className="text-blue-600">Chargement...</p>}
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
