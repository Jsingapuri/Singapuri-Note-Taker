//establishes dependency
const express = require("express");
const fs = require("fs");
const path = require("path");
const uuid = require("./helpers/uuid");
//sets th port
const PORT = process.env.PORT || 3001;
//express app
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.get("/api/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/db/db.json"))
);

//post request notes to the db.json
app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;
  const newNote = { title, text, id: uuid() };
  readAndAppend(newNote, "./db/db.json");
  res.json("note added");
});

//delete request for notes from the db.json
app.delete("/api/notes/:id", (req, res) => {
  const doneNote = req.params.id;
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.forEach((element, i) => {
        if (doneNote === element.id) {
          parsedData.splice(i, 1);
        }
      });
      writeToFile("./db/db.json", parsedData);
      res.json("note deleted");
    }
  });
});

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);

const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

/**
 *  Function to read data from a given a file and append some content
 *  @param {object} content The content you want to append to the file.
 *  @param {string} file The path to the file you want to save to.
 *  @returns {void} Nothing
 */
const readAndAppend = (content, file) => {
  fs.readFile(file, "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};
