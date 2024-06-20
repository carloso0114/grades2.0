import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import decodeToken from '../utils/decodeToken';
import styles from './StudentView.module.css'; // Import the CSS module

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
        <p className={styles.noNotesMessage}>No notes available</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Subject</th>
              <th className={styles.th}>Note 1</th>
              <th className={styles.th}>Note 2</th>
              <th className={styles.th}>Note 3</th>
              <th className={styles.th}>Final Note</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note, index) => (
              <tr
                key={note.id}
                className={index % 2 === 0 ? '' : styles.tbodyTrOdd}
              >
                <td className={styles.td}>{note.subject}</td>
                <td className={styles.td}>{note.note1}</td>
                <td className={styles.td}>{note.note2}</td>
                <td className={styles.td}>{note.note3}</td>
                <td className={styles.td}>{note.finalNote}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StudentView;