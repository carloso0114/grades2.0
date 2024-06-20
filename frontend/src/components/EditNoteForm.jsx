import { useState } from 'react';

function EditNoteForm({ note, onSubmit, onCancel }) {
  const [updatedNote, setUpdatedNote] = useState({ ...note });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedNote((prevNote) => ({
      ...prevNote,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(updatedNote);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Note</h2>
      <label>
        Student ID:
        <input type="text" name="student.username" value={updatedNote.student.username} onChange={handleChange} disabled />
      </label>
      <label>
        Subject:
        <input type="text" name="subject" value={updatedNote.subject} onChange={handleChange} disabled/>
      </label>
      <label>
        Note 1:
        <input type="text" name="note1" value={updatedNote.note1} onChange={handleChange} />
      </label>
      <label>
        Note 2:
        <input type="text" name="note2" value={updatedNote.note2} onChange={handleChange} />
      </label>
      <label>
        Note 3:
        <input type="text" name="note3" value={updatedNote.note3} onChange={handleChange} />
      </label>
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
}

export default EditNoteForm;
