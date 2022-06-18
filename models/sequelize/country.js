/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('country', {
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
    Code: {
      type: DataTypes.CHAR(3),
      allowNull: false
    },
    Size: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    Population: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    Continent: {
      type: DataTypes.STRING(45),
      allowNull: false
    }
  }, {
    tableName: 'country'
  });
};
