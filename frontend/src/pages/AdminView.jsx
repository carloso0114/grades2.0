import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const AdminView = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'student' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('users'); 
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const createUser = async () => {
    try {
      const response = await axiosInstance.post('users', newUser); 
      setUsers([...users, response.data]);
      setNewUser({ username: '', password: '', role: 'student' }); 
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axiosInstance.delete(`/users/${id}`); 
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
        <select name="role" value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} required
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>
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