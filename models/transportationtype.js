/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('transportationtype', {
    Id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    Name: {
      type: DataTypes.STRING(45),
      allowNull: false
    }
  }, {
    tableName: 'transportationtype'
  });
};
