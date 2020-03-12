module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('Customer', {
    nome: DataTypes.STRING,
    cpf: DataTypes.STRING,
    dataNascimento: DataTypes.DATE
  });
  Customer.associate = function(models) {
    Customer.hasOne(models.Endereco, {
      foreignKey: 'customerId',
      as: 'customer',
      onDelete: 'cascade' 
    });
  };
  return Customer;
}