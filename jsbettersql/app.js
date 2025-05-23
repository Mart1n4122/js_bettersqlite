import * as db from './util/database.js'
import express from 'express';

const PORT = 8080;
const app = express();

app.use(express.json());

app.get('/notes', (req, res) => {
  const notes = db.prepare('SELECT * FROM notes').all();
  res.json(notes);
});

app.get('/notes/:id', (req, res) => {
  const note = db.prepare('SELECT * FROM notes WHERE id = ?').get(req.params.id);
  if (!note) {
    return res.status(404).json({ error: 'Jegyzet nem található' });
  }
  res.json(note);
});

app.post('/notes', (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'A cím és a tartalom megadása kötelező' });
  }
  const result = db.prepare('INSERT INTO notes (title, content) VALUES (?, ?)').run(title, content);
  res.status(201).json({ id: result.lastInsertRowid });
});

app.delete('/notes/:id', (req, res) => {
  const result = db.prepare('DELETE FROM notes WHERE id = ?').run(req.params.id);
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Jegyzet nem található' });
  }
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Szerver fut a http://localhost:${PORT} címen`);
});