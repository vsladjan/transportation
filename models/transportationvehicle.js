/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('transportationvehicle', {
    Id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    Name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    Description: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    Color: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    ProductionYear: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    TransoprtationTypeId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'transoprtationtype',
        key: 'Id'
      }
    }
  }, {
    tableName: 'transportationvehicle'
  });
};
