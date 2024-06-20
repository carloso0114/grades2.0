import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance'; 
import decodeToken from '../utils/decodeToken';

const CreateNoteForm = ({ fetchNotes }) => {
  const [note1, setNote1] = useState('');
  const [note2, setNote2] = useState('');
  const [note3, setNote3] = useState('');
  const [subject, setSubject] = useState('');
  const [studentId, setStudentId] = useState('');
  const [error, setError] = useState('');
  const [students, setStudents] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const teacherId = decodeToken(token).id; 
    try {
      await axiosInstance.post('/notes', {
        note1,
        note2,
        note3,
        subject,
        studentId,
        teacherId
      });
      fetchNotes();
      setNote1('');
      setNote2('');
      setNote3('');
      setSubject('');
      setStudentId('');
    } catch (error) {
      console.error('Error creating note:', error.response.data.error);
      setError('Failed to create the note. Please try again.');
    }
  };

  useEffect(() => {
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

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Note 1:
        <input type="number" value={note1} onChange={(e) => setNote1(e.target.value)} />
      </label>
      <label>
        Note 2:
        <input type="number" value={note2} onChange={(e) => setNote2(e.target.value)} />
      </label>
      <label>
        Note 3:
        <input type="number" value={note3} onChange={(e) => setNote3(e.target.value)} />
      </label>
      <select
        name="studentId"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
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
        <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} />
      </label>
      <button type="submit">Create Note</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default CreateNoteForm;
