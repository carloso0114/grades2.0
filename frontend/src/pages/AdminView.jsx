import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminView = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/users'); // Adjust endpoint as per your backend setup
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const createUser = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/users', newUser); // Adjust endpoint as per your backend setup
      setUsers([...users, response.data]);
      setNewUser({ username: '', password: '', role: '' }); // Clear input fields after successful creation
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/users/${id}`); // Adjust endpoint as per your backend setup
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div>
      <h1>Admin View</h1>

      {/* Form for creating new user */}
      <form onSubmit={(e) => { e.preventDefault(); createUser(); }}>
        <input type="text" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} placeholder="Username" required />
        <input type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} placeholder="Password" required />
        <input type="text" value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} placeholder="Role" required />
        <button type="submit">Create User</button>
      </form>

      {/* List of users */}
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.username} ({user.role})
            <button onClick={() => deleteUser(user.id)}>Delete</button>
            {/* Add edit functionality if needed */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminView;