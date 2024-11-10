const express = require("express");
const { Command } = require('commander');
const path = require('path');
const fs = require('fs');
 
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

app.get('/',(req, res) => {
    res.send("Hello world!");
});

const server = app.listen(options.port, options.host, () => {
    console.log(`Server started at http://${options.host}:${options.port}`);
})

server.on('error', (err) => {
    console.error("server error: ", err);
}) 

