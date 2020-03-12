const express = require('express');
const router = express.Router();
const db = require('../models');
var Sequelize = require('sequelize');
const { Customer, Endereco, sequelize } = require('../models');

//create
router.post('/clientes', (req, res) => {
    const customer = req.body;
    Customer.create({ 
        nome: customer.nome, 
        cpf: customer.cpf, 
        dataNascimento: customer.dataNascimento}).then(function(customerAdicionado){
        Endereco.create({
            customerId:customerAdicionado.dataValues.id, 
            logradouro: customer.endereco.logradouro, 
            numero: customer.endereco.numero, 
            complemento: customer.endereco.complemento, 
            bairro: customer.endereco.bairro, 
            cidade: customer.endereco.cidade, 
            uf: customer.endereco.uf, 
            cep:customer.endereco.cep})
    });
    res.send('Cliente criado com sucesso');
});

//update
router.put('/clientes/:id', (req, res) => {
    const customer = req.body;
    var customerId = req.params.id;
    var customers = [];

    Customer.findOne({ where: {id: customerId} })
    .then(function(c) {
        if(c){
            return c.update({
                nome: customer.nome, 
                cpf: customer.cpf, 
                dataNascimento: customer.dataNascimento})
                .then(function(customerAtualizado){
                    Endereco.findOne({ where: {customerId: customerId} })
                    .then(function(e){
                        e.update({
                            logradouro: customer.endereco.logradouro, 
                            numero: customer.endereco.numero, 
                            complemento: customer.endereco.complemento, 
                            bairro: customer.endereco.bairro, 
                            cidade: customer.endereco.cidade, 
                            uf: customer.endereco.uf, 
                            cep:customer.endereco.cep})
                    });
            res.send('Cliente atualizado');
            });  
        }
        else
        {
            res.status(404).send('Cliente não encontrado');
        }
    });
});


//consultar
router.get('/clientes/:id', (req, res) => {
    var id = req.params.id;
    var customers = [];
    sequelize
    .query(`SELECT * FROM customers c inner join enderecos e on c.id = e.customerId where c.id = ${id}`, { type:Sequelize.QueryTypes.SELECT})
    .then(function(properties) {
        properties.forEach((item,index)=>{
            var customer = {};
            customer['id'] = item.id;
            customer['nome'] = item.nome;
            customer['cpf'] = item.cpf;
            customer['dataNascimento'] = item.dataNascimento;
            var endereco = {};
            endereco['logradouro'] = item.logradouro;
            endereco['numero'] = item.numero;
            endereco['complemento'] = item.complemento;
            endereco['bairro'] = item.bairro;
            endereco['cidade'] = item.cidade;
            endereco['uf'] = item.uf;
            endereco['cep'] = item.cep;
            customer['endereco'] = endereco;
            customers.push(customer);
        })
        if(customers.length > 0){
            res.send(JSON.stringify(customers, null, 4))
        }else{
            res.status(404).send('Cliente não encontrado');
        }
    });
});

//listar
router.get('/clientes/', (req, res) => {
   var customers = [];
    sequelize
    .query("SELECT * FROM customers c inner join enderecos e on c.id = e.customerId", { type:Sequelize.QueryTypes.SELECT})
    .then(function(properties) {
        properties.forEach((item,index)=>{
            var customer = {};
            customer['id'] = item.id;
            customer['nome'] = item.nome;
            customer['cpf'] = item.cpf;
            customer['dataNascimento'] = item.dataNascimento;
            var endereco = {};
            endereco['logradouro'] = item.logradouro;
            endereco['numero'] = item.numero;
            endereco['complemento'] = item.complemento;
            endereco['bairro'] = item.bairro;
            endereco['cidade'] = item.cidade;
            endereco['uf'] = item.uf;
            endereco['cep'] = item.cep;
            customer['endereco'] = endereco;
            customers.push(customer);
        })
        res.send(JSON.stringify(customers, null, 4))
    });
});

//deletar
router.delete('/clientes/:id', (req, res) => {
    var idParam = req.params.id;

    Customer.findOne({where: {id: idParam}}).then(function(clienteBuscado){
        console.log('clienteBuscado: ' + clienteBuscado);
        if(clienteBuscado != null){
            Endereco.destroy({where: {customerId: idParam}})
            Customer.destroy({where: {id: idParam}});
            res.send(`Cliente removido`);
        }else{
            res.status(404).send('Cliente não encontrado');
        }
    });
});

module.exports = router;