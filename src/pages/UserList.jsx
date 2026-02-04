import { useState, useEffect } from 'react';
import EditModal from '../components/EditModal';
import '../App.css'; // Reusing styles

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      console.log('Fetching users...');
      const response = await fetch('/api/users');
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Users data received:', data);
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // Auto-refresh every 5 seconds
    const interval = setInterval(fetchUsers, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await fetch(`/api/users/${id}`, {
          method: 'DELETE',
        });
        fetchUsers(); // Refresh list
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        setIsModalOpen(false);
        fetchUsers(); // Refresh list
      } else {
        alert('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div className="container" style={{ flexDirection: 'column', alignItems: 'center', marginTop: '5rem' }}>
      <header style={{ borderBottom: 'none', marginBottom: '1rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem' }}>Registered Users ({users.length})</h1>
      </header>

      {loading ? (
        <p>Loading...</p>
      ) : !Array.isArray(users) ? (
        <p className="status-message error">Error: Invalid data format received</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="table-wrapper form-wrapper" style={{ padding: '0' }}>
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Father Name</th>
                <th>Occupation</th>
                <th>College</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.fatherName}</td>
                  <td>{user.occupation}</td>
                  <td>{user.college}</td>
                  <td>{user.address}</td>
                  <td className="actions-cell">
                    <button className="edit-btn" onClick={() => handleEdit(user)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(user._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <EditModal 
          user={selectedUser} 
          onClose={() => setIsModalOpen(false)} 
          onUpdate={handleUpdate} 
        />
      )}
    </div>
  );
};

export default UserList;
