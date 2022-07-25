const express = require('express');
const fs = require('fs');

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

// POST request to add notes
app.post('/notes', (req, res) => {
    console.info(`${req.method} request received to add a note`);

    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;
  
    // If all the required properties are present
    if (title && text) {
      // Variable for the object we will save
      const newNote = {
        title,
        text,
        note_id: uuid(), // is this necessary? how is it checking id..
      };
  
      // Convert the data to a string so we can save it
      const noteString = JSON.stringify(newNote, null, '\t');
  
      // Write the string to a file
      fs.writeFile(`./db/${newNote.title}.json`, noteString, (err) =>
        err
          ? console.error(err)
          : console.log(
              `${newNote.title} note has been written to JSON file`
            )
      );
  
    //   const response = {
    //     status: 'success',
    //     body: newNote,
    //   };
  
      console.log(response);
      res.json(response);
    } else {
      res.json('Error in logging note');
    }
});

// Set up the listener to host
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);