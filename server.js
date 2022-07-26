const express = require('express');
const fs = require('fs');
const path = require('path');

// Sets our viewport
const PORT = process.env.PORT || 3001;

const app = express();

const dbPath = './db/db.json';

// Function to create a random id for each note
function uuid()
{
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}

// Allows us to parse our JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) => {
  console.info('GET /');
  res.sendFile(path.join(__dirname, '/public/index.html'))
});

// Get Route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET Route for api info
app.get('/api/notes', (req, res) => {
  console.log("GET /api/notes");
  var dbObj = JSON.parse(fs.readFileSync(dbPath));
  res.json(dbObj);
});

// GET Route for anything else to force to homepage
app.get('*', (req, res) => {
  console.log("GET *");
  res.sendFile(path.join(__dirname, '/public/index.html'))
});

// POST request to add notes
app.post('/api/notes', (req, res) => {
  //  console.log("POST /api/notes");
    console.info(`${req.method} request received to add a note`);

    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;
  
    // Check that both our info fields are filled 
    if (title && text) {
      // Variable for the object we will save
      const newNote = {
        title,
        text,
        id: uuid(),
      };
  
      if(fs.existsSync(dbPath))
      {
        // Open the file
        var dbObj = JSON.parse(fs.readFileSync(dbPath));

        // Add our note to the array
        dbObj.push(newNote)

        // Make our db info a string so we can save it
        const dbString = JSON.stringify(dbObj, null, '\t');
        
        // Save our entire json file
        fs.writeFile(dbPath, dbString, (err) =>
        err
        ? console.error(err)
        : console.log(
            `${newNote.title} note has been written to JSON file`
          )
        );
      }
      
    // If our note successfully saves to our json file, set response status to success
      const response = {
        status: 'success'
      };
  
      console.log(response);
      res.json(response);

    // If our note does not save, let us know there was in error
    } else {
      res.json('Error in logging note');
    }
});

// Set up the listener to host
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);