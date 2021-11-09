const express = require('express')
const cors = require('cors');
const http = require('http');
const bodyParser = require('body-parser')


const app = express()
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// creating server !important
const server = http.createServer(app);
const PORT = process.env.PORT || 4000

// router
const routes = require('./routes');
app.use('/', routes)


server.listen(PORT, () => {
    console.log("Server is running on Port: " + PORT);
});