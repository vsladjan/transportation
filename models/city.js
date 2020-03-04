/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('city', {
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
    Population: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    Size: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    CountryId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'country',
        key: 'Id'
      }
    }
  }, {
    tableName: 'city'
  });
};
