/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('route', {
    Id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    Name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    Description: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    tableName: 'route'
  });
};
