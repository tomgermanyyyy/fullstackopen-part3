require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();

app.use(express.static('build'));
app.use(express.json());
app.use(cors());

morgan.token('data', (req, res) => JSON.stringify(req.body));

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :data')
);

app.get('/', (req, res) => {
  res.send('API Server running... 🚀');
});

app.get('/info', (req, res, next) => {
  Person.find({})
    .then((persons) =>
      res.send(
        `<p>Phonebook has info for ${persons.length} people</p> 
         <p>${new Date()}</p>`
      )
    )
    .catch((err) => next(err));
});

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then((persons) => res.json(persons))
    .catch((err) => next(err));
});

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => res.json(person))
    .catch((err) => next(err));
});

app.post('/api/persons', (req, res, next) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'name or number missing' });
  }

  const newPerson = new Person({ name: body.name, number: body.number });

  newPerson
    .save()
    .then((result) => res.json(result))
    .catch((err) => next(err));
});

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).send({ error: 'name or number missing' });
  }

  const updateInfo = { name: body.name, number: body.number };

  Person.findById(req.params.id)
    .then((person) => {
      if (person === null) {
        return res.status(400).send({ error: 'id not found' });
      }

      if (person.name !== body.name) {
        return res.status(400).send({ error: 'name not match id' });
      } else {
        Person.findByIdAndUpdate(req.params.id, updateInfo, { new: true })
          .then((updatedPerson) => res.json(updatedPerson))
          .catch((err) => next(err));
      }
    })
    .catch((err) => next(err));
});

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => {
      console.log('after delete', result);
      res.status(204).end();
    })
    .catch((err) => next(err));
});

const errorHandler = (err, req, res, next) => {
  console.log(err.message);

  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformed id' });
  }

  next(err);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
