import React, { useEffect, useState } from 'react';
import { showToast } from '../lib/toast.js';
import { apiClient } from '../lib/api.js';

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get('/admin/users');
      setUsers(data || []);
    } catch (error) {
      showToast('Could not load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await apiClient.put(`/admin/users/${userId}/role`, { role: newRole });
      showToast('User role updated!');
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    } catch (error) {
      showToast('Failed to update role.');
    }
  };

  if (loading) return <p className="text-center text-lg">Loading users...</p>;

  return (
    <section className="max-w-4xl mx-auto panel-glass p-8 md:p-12 rounded-2xl">
      <h2 className="text-3xl font-bold mb-8">Manage Users</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-gray-700/50">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-800/50">
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">
                  <select className="form-input bg-gray-800" value={user.role} onChange={(e) => handleRoleChange(user.id, e.target.value)}>
                    <option value="STUDENT">STUDENT</option>
                    <option value="ORGANIZER">ORGANIZER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
