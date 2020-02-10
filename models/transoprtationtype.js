/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('transoprtationtype', {
    Id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    Name: {
      type: DataTypes.STRING(45),
      allowNull: false
    }
  }, {
    tableName: 'transoprtationtype'
  });
};
