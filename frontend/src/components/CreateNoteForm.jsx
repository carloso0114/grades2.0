import { useState, useEffect  } from 'react';
import axiosInstance from '../api/axiosInstance';
import decodeToken from '../utils/decodeToken';

function CreateNoteForm({ fetchNotes, onCancel }) {
  const [students, setStudents] = useState([]);
  
  const [note, setNote] = useState({
    studentId: '',
    teacherId: '',
    subject: '',
    note1: '',
    note2: '',
    note3: '',
    finalNote: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const teacherId = decodeToken(token).id; 
    setNote(prevNote => ({ ...prevNote, teacherId }));
    const fetchStudents = async () => {
      try {
        const response = await axiosInstance.get('/users/students');
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
        setError('Failed to fetch students. Please try again.');
      }
    };

    fetchStudents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNote((prevNote) => ({
      ...prevNote,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/notes', note);
      fetchNotes();
      onCancel(); // Hide the create form
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Note</h2>
      <select
        name="studentId"
        value={note.studentId}
        onChange={handleChange}
        required
      >
        <option value="">Select Student</option>
        {students.map((student) => (
          <option key={student.id} value={student.id}>
            {student.username}
          </option>
        ))}
      </select>
      <label>
        Subject:
        <input type="text" name="subject" value={note.subject} onChange={handleChange} />
      </label>
      <label>
        Note 1:
        <input type="text" name="note1" value={note.note1} onChange={handleChange} />
      </label>
      <label>
        Note 2:
        <input type="text" name="note2" value={note.note2} onChange={handleChange} />
      </label>
      <label>
        Note 3:
        <input type="text" name="note3" value={note.note3} onChange={handleChange} />
      </label>
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
}

export default CreateNoteForm;
