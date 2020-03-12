var express = require('express');
var path = require('path');

var app = express();

const { Customer, Endereco } = require('./app/models');

app.use(express.urlencoded({ extended: false }));

Customer.create({ nome: 'Yann2', cpf: 'claudio@rocketseat.com.br', dataNascimento: new Date() });
Endereco.create({customerId: 1, logradouro: 'Rua tal', numero: 'abc123', complemento: 'aa', bairro:'cordeiro', cidade:'cidade', uf:'pe', cep:'50-630'});

app.get('/prova/', (req, res) => {
  res.send('Hello World!');
});

app.listen(8080);
