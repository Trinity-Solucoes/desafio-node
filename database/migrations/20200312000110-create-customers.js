'use strict';

module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('Customers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      nome: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      dataNascimento: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      cpf: {
        allowNull: false,
        type: DataTypes.STRING
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      }
    }).then(function(){
      queryInterface.createTable('Enderecos', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        customerId: {
          type: DataTypes.INTEGER,
          references: { model: 'Customers', key: 'id' }
        },
        logradouro: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        numero: {
          allowNull: false,
          type: DataTypes.STRING
        },
        complemento: {
          allowNull: false,
          type: DataTypes.STRING
        },
        bairro: {
          allowNull: false,
          type: DataTypes.STRING
        },
        cidade: {
          allowNull: false,
          type: DataTypes.STRING
        },
        uf: {
          allowNull: false,
          type: DataTypes.STRING
        },
        cep: {
          allowNull: false,
          type: DataTypes.STRING
        },
        createdAt: {
          allowNull: false,
          type: DataTypes.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: DataTypes.DATE,
        }
      })
    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('Enderecos').then(function(){queryInterface.dropTable('Customers')});
  }
};
