const express = require('express');
const path = require('path');
const app = express();
app.use('/node_modules', express.static(path.resolve(__dirname, './node_modules')));
app.use('/', express.static('./'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/todos', function(req, res, next) {
   res.json([{ title: 'One'}]);
});

app.listen(3000, () => console.log(
    'Express server running at http://127.0.0.1:3000'));