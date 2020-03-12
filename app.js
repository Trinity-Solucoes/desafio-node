var express = require('express');
var bodyParser = require("body-parser");
var app = express();

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

const clienteRouter = require('./app/routes/cliente');
app.use('/prova/api', clienteRouter);
app.listen(8080);