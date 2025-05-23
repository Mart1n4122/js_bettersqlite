import Database from 'better-sqlite3';
const db = new Database('./data/notes.sqlite');


db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL
  )
`);

const existingNotes = db.prepare('SELECT COUNT(*) AS count FROM notes').get().count;
if (existingNotes === 0) {
  const insert = db.prepare('INSERT INTO notes (title, content) VALUES (?, ?)');
  insert.run('Első jegyzet', 'Ez az első jegyzet tartalma.');
  insert.run('Második jegyzet', 'Ez a második jegyzet tartalma.');
  insert.run('Harmadik jegyzet', 'Ez a harmadik jegyzet tartalma.');
  insert.run('Negyedik jegyzet', 'Ez a negyedik jegyzet tartalma.');
}

export const getAllNotes = () => {
  return db.prepare('SELECT * FROM notes').all();
}
export const getNoteById = (id) => {
  return db.prepare('SELECT * FROM notes WHERE id = ?').get(id);
}
export const createNote = (title, content) => {
  const stmt = db.prepare('INSERT INTO notes (title, content) VALUES (?, ?)');
  return stmt.run(title, content);
}
export const deleteNote = (id) => {
  const stmt = db.prepare('DELETE FROM notes WHERE id = ?');
  return stmt.run(id);
}