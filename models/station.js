/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('station', {
    Id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    Name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    Description: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    Location: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    CityAreaId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'cityarea',
        key: 'Id'
      }
    }
  }, {
    tableName: 'station'
  });
};
