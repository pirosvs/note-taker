const express = require('express');

// Sets our viewport
const PORT = process.env.PORT || 3001;

const app = express();

// Allows us to parse our JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET Route for anything else to force to homepage
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// Set up the listener to host
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);