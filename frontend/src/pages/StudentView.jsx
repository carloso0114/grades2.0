import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import decodeToken from '../utils/decodeToken';

function StudentView() {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    const fetchNotes = async () => {
      const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
      if (token) {
        const decoded = decodeToken(token);
        const userId = decoded.id;
        try {
          const response = await axiosInstance.get(`/notes/user/${userId}`);
          if (response.data.message) {
            setError(response.data.message);
          } else {
            setNotes(response.data);
          }
        } catch (error) {
          console.error('Error fetching notes:', error);
          setError('Failed to fetch notes. Please try again.');
        }
      } else {
        setError('No token found');
      }
    };

    fetchNotes();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }
  return (
    <div>
      <h1>Your Notes</h1>
      {notes.length === 0 ? (
        <p>No notes available</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Note 1</th>
              <th>Note 2</th>
              <th>Note 3</th>
              <th>Final Note</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note) => (
              <tr key={note.id}>
                <td>{note.subject}</td>
                <td>{note.note1}</td>
                <td>{note.note2}</td>
                <td>{note.note3}</td>
                <td>{note.finalNote}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StudentView;