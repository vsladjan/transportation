/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cityarea', {
    Id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    Name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    Size: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    Description: {
      type: DataTypes.STRING(90),
      allowNull: true
    },
    CityId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'city',
        key: 'Id'
      }
    }
  }, {
    tableName: 'cityarea'
  });
};
