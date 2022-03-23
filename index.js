import express from 'express';
import cors from 'cors';
import isUndefined from './utils/isUndefined.js';
import loggerMidleware from './loggerMiddleware.js';

let notes = [
  {
    id: 1,
    content: 'Me tengo que suscribir a @midudev en YouTube y Twitch',
    date: '2019-05-30T17:30:31.098Z',
    important: true
  },
  {
    id: 2,
    content: 'Tengo que estudiar las clases del FullStack Bootcamp',
    date: '2019-05-30T18:39:34.091Z',
    important: false
  },
  {
    id: 3,
    content: 'Repasar los retos de JS de midudev',
    date: '2019-05-30T19:20:14.298Z',
    important: true
  }
];

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(cors());
app.use(loggerMidleware);

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>');
});

app.get('/api/notes', (req, res) => {
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const note = req.body;

  if (!note || !note.content) {
    return res.status(400).json({
      error: 'note or note.content is missing'
    });
  }

  const ids = notes.map((n) => n.id);
  const maxId = Math.max(...ids);
  const newNote = {
    id: maxId + 1,
    content: note.content,
    important: isUndefined(note.important) ? false : note.important,
    date: new Date().toISOString()
  };

  notes = [...notes, newNote];

  res.status(201).json(newNote);
});

app.get('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id);
  const note = notes.find((n) => n.id === id);

  note ? res.json(note) : res.status(404).end();
});

app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id);
  notes = notes.filter((n) => n.id !== id);

  res.status(204).end();
});

app.use((req, res) => {
  res.status(404).json({
    error: 'Not found'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
