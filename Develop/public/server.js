const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 8080;
// const mainDir = path.join(__dirname, "/public");
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'notes.html')));
// app.use(express.static('public'));
app.use(express.static(__dirname));
// app.use(express.static(path.join(__dirname, 'public/assets/css')));
app.use(express.urlencoded({extended: true}));
app.use(express.json())

app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "../db/db.json"));
});

app.get("/api/notes/:id", function(req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("../db/db.json", "utf8"));
    res.json(savedNotes[Number(req.params.id)]);
});

app.post("/api/notes", function(req, res) {
  let savedNotes = JSON.parse(fs.readFileSync("../db/db.json", "utf8"));
  let newNote = req.body;
  let uniqueID = (savedNotes.length).toString();
  newNote.id = uniqueID;
  savedNotes.push(newNote);

  fs.writeFileSync("../db/db.json", JSON.stringify(savedNotes));
  res.json(savedNotes);
});

app.delete("/api/notes/:id", function(req, res) {
  let savedNotes = JSON.parse(fs.readFileSync("../db/db.json", "utf8"));
  let noteID = req.params.id;
  let newID = 0;
  console.log(`Deleting note with ID ${noteID}`);
  savedNotes = savedNotes.filter(currNote => {
      return currNote.id != noteID;
  })
  
  for (currNote of savedNotes) {
      currNote.id = newID.toString();
      newID++;
  }

  fs.writeFileSync("../db/db.json", JSON.stringify(savedNotes));
  res.json(savedNotes);
})

app.listen(port, function() {
    console.log(`Now listening to port ${port}. Enjoy your stay!`);
});