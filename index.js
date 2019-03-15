const express = require('express');
const helmet = require('helmet');
const knex = require('knex')

const knexConfig = {
  client: 'sqlite3',
  connection: {
    filename: './data/lambda.sqlite3',
  },
  useNullAsDefault: true,
}

const db = knex(knexConfig)
const server = express();

server.use(express.json());
server.use(helmet());

// endpoints here

server.post('/api/zoos', async (req, res) => {
  try {
    const [id] = await db('zoos').insert(req.body)

    const zoo = await db('zoos')
      .where({ id })
      .first()
    res.status(201).json(zoo)

    // db.insert(req.body).into('zoos').then(ids => res.status(201).json(ids))
  } catch(error) {
    res.status(500).json({ error: "some useless error message. j/k the animal already exist"})
  }
})

server.get('/api/zoos', async (req, res) => {
  try {
    const zoos = await db('zoos')
    res.status(200).json(zoos)
  } catch(error) {
    res.status(500).json(error)
  }
})

server.get('/api/zoos/:id', async (req, res) => {
  try {
    const zoo = await db('zoos').where({ id: req.params.id }).first()
    res.status(200).json(zoo)
  } catch(error) {
    res.status(500).json(error)
  }
})

server.put('/api/zoos/:id', async (req, res) => {
  try{
    const updatedItem = await db('zoos').where({ id: req.params.id }).update(req.body)

    if (updatedItem > 0) {
      const zoo = await db('zoos').where({ id: req.params.id }).first()
      res.status(200).json(zoo)
    } else {
      res.status(404).json({ message: "record not found"})
    }
  } catch(error) {
    res.status(500).json(error)
  }
})

server.delete('/api/zoos/:id', async (req, res) => {
  try {
    const deletedItem = await db('zoos').where({ id: req.params.id}).delete()

    if (deletedItem > 0) {
      res.status(204).end()
    } else {
      res.status(404).json({ message: 'record not found'})
    }
  } catch(error) {
    res.status(500).json(error)
  }
})

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
