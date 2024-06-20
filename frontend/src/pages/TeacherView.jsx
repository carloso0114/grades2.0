import { useState, useEffect } from 'react';
import CreateNoteForm from '../components/CreateNoteForm';
import axiosInstance from '../api/axiosInstance'; 

function TeacherView() {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axiosInstance.get('/notes');
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
      setError('Failed to fetch notes. Please try again.');
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Teacher's Notes</h1>
      {notes.length === 0 ? (
        <p>No notes available</p>
      ) : (
        <ul>
          {notes.map((note) => (
            <li key={note.id}>
              <strong>Student ID:</strong> {note.student.username}, <strong>Subject:</strong> {note.subject}, 
              <strong> Note 1:</strong> {note.note1}, <strong>Note 2:</strong> {note.note2}, 
              <strong>Note 3:</strong> {note.note3}, <strong>Final Note:</strong> {note.finalNote}
            </li>
          ))}
        </ul>
      )}
      <CreateNoteForm fetchNotes={fetchNotes}/>
    </div>
  );
}

export default TeacherView;

