/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('routestation', {
    StationId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'station',
        key: 'Id'
      }
    },
    RouteId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'route',
        key: 'Id'
      }
    },
    TransportationVehicleId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'transportationvehicle',
        key: 'Id'
      }
    },
    Time: {
      type: DataTypes.TIME,
      allowNull: false,
      primaryKey: true
    },
    Type: {
      type: DataTypes.STRING(10),
      allowNull: false
    }
  }, {
    tableName: 'routestation'
  });
};
