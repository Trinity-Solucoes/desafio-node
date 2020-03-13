module.exports = (sequelize, DataTypes) => {
  const customer = sequelize.define('customer', {
    nome: DataTypes.STRING,
    cpf: DataTypes.STRING,
    dataNascimento: DataTypes.STRING
  });
  customer.associate = function(models) {
    customer.hasOne(models.endereco, {
      foreignKey: 'customerId',
      as: 'customer',
      onDelete: 'cascade' 
    });
  };
  return customer;
}