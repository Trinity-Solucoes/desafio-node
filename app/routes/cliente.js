const express = require('express');
const router = express.Router();
var Sequelize = require('sequelize');
const { customer, endereco, sequelize } = require('../models');

//create
router.post('/clientes', (req, res) => {
    const customerBody = req.body;
    customer.create({ 
        nome: customerBody.nome, 
        cpf: customerBody.cpf, 
        dataNascimento: customerBody.dataNascimento}).then(function(customerAdicionado){
        endereco.create({
            customerId:customerAdicionado.dataValues.id, 
            logradouro: customerBody.endereco.logradouro, 
            numero: customerBody.endereco.numero, 
            complemento: customerBody.endereco.complemento, 
            bairro: customerBody.endereco.bairro, 
            cidade: customerBody.endereco.cidade, 
            uf: customerBody.endereco.uf, 
            cep:customerBody.endereco.cep})
    });
    res.send('Cliente criado com sucesso');
});

//update
router.put('/clientes/:id', (req, res) => {
    const customerBody = req.body;
    var customerId = req.params.id;

    customer.findOne({ where: {id: customerId} })
    .then(function(c) {
        if(c){
            return c.update({
                nome: customerBody.nome, 
                cpf: customerBody.cpf, 
                dataNascimento: customerBody.dataNascimento})
                .then(function(customerAtualizado){
                    endereco.findOne({ where: {customerId: customerId} })
                    .then(function(e){
                        e.update({
                            logradouro: customerBody.endereco.logradouro, 
                            numero: customerBody.endereco.numero, 
                            complemento: customerBody.endereco.complemento, 
                            bairro: customerBody.endereco.bairro, 
                            cidade: customerBody.endereco.cidade, 
                            uf: customerBody.endereco.uf, 
                            cep:customerBody.endereco.cep})
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

    customer.findOne({where: {id: idParam}}).then(function(clienteBuscado){
        console.log('clienteBuscado: ' + clienteBuscado);
        if(clienteBuscado != null){
            endereco.destroy({where: {customerId: idParam}})
            customer.destroy({where: {id: idParam}});
            res.send(`Cliente removido`);
        }else{
            res.status(404).send('Cliente não encontrado');
        }
    });
});

module.exports = router;