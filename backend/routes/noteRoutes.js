import express from 'express';
import { Notes, User } from '../models.js';
import authenticateJWT from '../middlewares/auth.js';

const router = express.Router();

// CREATE a new note
router.post('/', authenticateJWT, async (req, res) => {
  const { note1, note2, note3, studentId, subject, teacherId } = req.body;
  try {
    const newNote = await Notes.create({ note1, note2, note3, studentId, subject, teacherId });
    res.status(201).json(newNote);
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// READ all notes
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const notes = await Notes.findAll({
      include: [
        { model: User, as: 'student' },
        { model: User, as: 'teacher' }
      ]
    });
    res.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// UPDATE a note
router.put('/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { note1, note2, note3, studentId, subject, teacherId } = req.body;
  try {
    const note = await Notes.findByPk(id);
    if (note) {
      note.note1 = note1;
      note.note2 = note2;
      note.note3 = note3;
      note.studentId = studentId;
      note.subject = subject;
      note.teacherId = teacherId;
      await note.save();
      res.json(note);
    } else {
      res.status(404).json({ error: 'Note not found' });
    }
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// DELETE a note
router.delete('/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  try {
    const note = await Notes.findByPk(id);
    if (note) {
      await note.destroy();
      res.json({ message: 'Note deleted' });
    } else {
      res.status(404).json({ error: 'Note not found' });
    }
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

export default router;
