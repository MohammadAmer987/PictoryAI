import { useState, useEffect } from 'react';
import '../../css/admincss/User.css';
import UsersTable from './UsersTable';
import { getAllUsers } from '../../Services/adminService';

export default function Users({ searchQuery }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="usersPage">
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="usersPage">
        <div style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="usersPage">
      <UsersTable users={users} searchQuery={searchQuery} />
    </div>
  );
}
