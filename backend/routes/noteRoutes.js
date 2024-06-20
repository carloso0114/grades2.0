import express from 'express';
import { Notes, User } from '../models.js';
import authenticateJWT from '../middlewares/auth.js';

const router = express.Router();

// CREATE a new note
router.post('/', authenticateJWT, async (req, res) => {
  const { note1, note2, note3, studentId, subject, teacherId } = req.body;

  const cleanedNote = {
    note1: note1 === '' ? null : note1,
    note2: note2 === '' ? null : note2,
    note3: note3 === '' ? null : note3,
    studentId,
    subject,
    teacherId
  };
  try {
    const newNote = await Notes.create(cleanedNote);
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

// READ notes by user ID
router.get('/user/:userId', authenticateJWT, async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: `Student not found with id ${userId}` });
    }
    if (user.role !== 'student') {
      return res.status(400).json({ error: 'User is not a student' });
    }
    const notes = await Notes.findAll({
      where: { studentId: userId },
      include: [
        { model: User, as: 'student' },
        { model: User, as: 'teacher' }
      ]
    });
    if (notes.length === 0) {
      return res.json({ message: "You don't have any grades yet." }); // Adjust message as needed
    }
    res.json(notes);
  } catch (error) {
    console.error('Error fetching notes by user ID:', error);
    res.status(500).json({ error: 'Failed to fetch notes by user ID' });
  }
});

// PATCH (partial update) a note
router.patch('/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { note1, note2, note3, studentId, subject, teacherId } = req.body;

  // Convert empty string values to null
  const cleanedNote = {
    note1: note1 === '' ? null : note1,
    note2: note2 === '' ? null : note2,
    note3: note3 === '' ? null : note3,
    studentId,
    subject,
    teacherId
  };

  try {
    const note = await Notes.findByPk(id);
    if (note) {
      Object.keys(cleanedNote).forEach(key => {
        if (cleanedNote[key] !== undefined) {
          note[key] = cleanedNote[key];
        }
      });
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
