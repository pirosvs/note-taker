const express = require('express');
const fs = require('fs');

// Sets our viewport
const PORT = process.env.PORT || 3001;

const path = require('path');

const app = express();

const dbPath = './db/db.json'

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

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET Route for notes page
app.get('/api/notes', (req, res) => {
  console.log("GET /api/notes");
  var dbObj = JSON.parse(fs.readFileSync(dbPath));
  res.json(dbObj);
 // res.sendFile(path.join(__dirname, '/public/notes.html'))
});

// GET Route for anything else to force to homepage
// app.get('*', (req, res) => {
//   console.log("GET *");
//   res.sendFile(path.join(__dirname, '/public/index.html'))
// });

// POST request to add notes
app.post('/api/notes', (req, res) => {
  //  console.log("POST /api/notes");
    console.info(`${req.method} request received to add a note`);

    // Destructuring assignment for the items in req.body
    //const title = req.body.title;
    //const text = req.body.text;



    const { title, text } = req.body;
  
    // If all the required properties are present
    if (title && text) {
      // Variable for the object we will save
      const newNote = {
        title,
        text,
        id: uuid(), // is this necessary? how is it checking id..
      };
  
      // 
     
  
      if(fs.existsSync(dbPath))
      {
        // open it
        var dbObj = JSON.parse(fs.readFileSync(dbPath));

        // add our note to the array
        dbObj.push(newNote)

        // save the file
        // Convert the data to a string so we can save it
        const dbString = JSON.stringify(dbObj, null, '\t');
        
        // Write the string to a file
        fs.writeFile(dbPath, dbString, (err) =>
        err
        ? console.error(err)
        : console.log(
            `${newNote.title} note has been written to JSON file`
          )
        );
      }
      
      const response = {
        status: 'success'
      };
  
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