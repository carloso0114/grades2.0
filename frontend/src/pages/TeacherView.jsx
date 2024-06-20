import { useState, useEffect } from 'react';
import CreateNoteForm from '../components/CreateNoteForm';
import axiosInstance from '../api/axiosInstance';
import EditNoteForm from '../components/EditNoteForm';
import styles from './TeacherView.module.css'

function TeacherView() {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

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

  const handleEditClick = (note) => {
    setEditingNote(note);
    setIsCreating(false); // Hide the create form if it's open
  };

  const handleEditSubmit = async (updatedNote) => {
    try {
      await axiosInstance.patch(`/notes/${updatedNote.id}`, updatedNote);
      fetchNotes(); // Refresh the notes
      setEditingNote(null); // Close the edit form
    } catch (error) {
      console.error('Error updating note:', error);
      setError('Failed to update note. Please try again.');
    }
  };

  const handleCreateClick = () => {
    setIsCreating(true);
    setEditingNote(null); // Hide the edit form if it's open
  };

  const handleCreateCancel = () => {
    setIsCreating(false);
  };

  const handleEditCancel = () => {
    setEditingNote(null);
  };

  const handleDeleteClick = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await axiosInstance.delete(`/notes/${noteId}`);
        fetchNotes(); 
      } catch (error) {
        console.error('Error deleting note:', error);
        setError('Failed to delete note. Please try again.');
      }
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  return (
<div>
      <h1>Teacher's Notes</h1>
      <button onClick={handleCreateClick}>Add New Note</button>
      {notes.length === 0 ? (
        <p>No notes available</p>
      ) : (
        <table className={styles.notesTable}>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Subject</th>
              <th>Note 1</th>
              <th>Note 2</th>
              <th>Note 3</th>
              <th>Final Note</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note) => (
              <tr key={note.id}>
                <td>{note.student.username}</td>
                <td>{note.subject}</td>
                <td>{note.note1}</td>
                <td>{note.note2}</td>
                <td>{note.note3}</td>
                <td>{note.finalNote}</td>
                <td>
                  <button onClick={() => handleEditClick(note)}>Edit</button>
                  <button onClick={() => handleDeleteClick(note.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {editingNote && (
        <EditNoteForm note={editingNote} onSubmit={handleEditSubmit} onCancel={handleEditCancel} />
      )}
      {isCreating && (
        <CreateNoteForm fetchNotes={fetchNotes} onCancel={handleCreateCancel} />
      )}
    </div>
  );
}

export default TeacherView;
