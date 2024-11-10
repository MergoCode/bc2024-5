const express = require("express");
const { Command } = require('commander');
const path = require('path');
const fs = require('fs');
const exp = require("constants");
 
const program = new Command();

program
    .requiredOption('-h, --host <host>', 'Server Address')
    .requiredOption('-p, --port <port>', 'Server Port')
    .requiredOption('-c, --cache <cache>', 'Cache directory path')

program.parse(process.argv);

const options = program.opts();

const cacheDirectory = path.resolve(options.cache);
if (!fs.existsSync(cacheDirectory)) {
    console.error(`Directory cache path is invalid`);
    process.exit(1);
}

const app = express();
app.use(express.json());

app.get('/',(req, res) => {
    res.send("Hello world!");
});

const server = app.listen(options.port, options.host, () => {
    console.log(`Server started at http://${options.host}:${options.port}`);
})

server.on('error', (err) => {
    console.error("server error: ", err);
}) 
let notes = [];
const newNote = {
    name: "notatka",
    text: "lol"
}
notes.push(newNote);
app.get(`/notes/:name`, (req, res) => {
    const name = req.params.name;

    const note = notes.find(note => note.name === name);

    if (!note) {
        console.log(`Note not found: ${name}`);
        res.status(404).send("Note not found!");
    }
    
    res.send(note.text);
});

app.post('/notes/write', (req, res) => {
    const { name } = req.body; 

    if (!name) {
        return res.status(400).send("Name parameter is required.");
    }

    console.log(`Received request to create note with name: ${name}`);

    const note = notes.find(note => note.name === name);

    if (note) {
        return res.status(409).send("Note already exists!");
    }

    const newNote = {
        name: name,
        text: req.body.text || "No text provided" 
    };

    notes.push(newNote);
    return res.status(201).send(newNote);
});

