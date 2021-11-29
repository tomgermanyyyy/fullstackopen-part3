const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

morgan.token('data', (req, res) => JSON.stringify(req.body));

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :data')
);

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

const generateId = () => {
  return Math.floor(Math.random() * 1000000000);
};

app.get('/', (req, res) => {
  res.send('API Server running... 🚀');
});

app.get('/info', (req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p> 
     <p>${new Date()}</p>`
  );
});

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id === id);

  if (!person) {
    return res.status(404).end();
  }

  res.json(person);
});

app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'name or number missing' });
  }

  if (persons.find((p) => p.name === body.name)) {
    return res.status(400).json({ error: 'name must be unique' });
  }

  const newPerson = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(newPerson);

  res.json(newPerson);
});

app.put('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const body = req.body;
  persons = persons.map((p) => (p.id !== id ? p : body));
  res.json(body);
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((p) => p.id !== id);
  res.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
