const Sequelize = require('sequelize');
const config = require('./config.json');

const sequelize = new Sequelize('transportation', config.db_username, config.db_password, {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
    operatorsAliases: false,
    define: {
      timestamps: false,
      freezeTableName: true
    },
   
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });

  const db = {};

  db.Sequelize = Sequelize;
  db.sequelize = sequelize;

//Models/tables
db.country = require('./models/sequelize/country.js')(sequelize, Sequelize)
db.city = require('./models/sequelize/city.js')(sequelize, Sequelize)
db.cityarea = require('./models/sequelize/cityarea.js')(sequelize, Sequelize)
db.station = require('./models/sequelize/station.js')(sequelize, Sequelize)
db.transportationtype = require('./models/sequelize/transportationtype.js')(sequelize, Sequelize)
db.transportationvehicle = require('./models/sequelize/transportationvehicle.js')(sequelize, Sequelize)
db.route = require('./models/sequelize/route.js')(sequelize, Sequelize)
db.routestation = require('./models/sequelize/routestation.js')(sequelize, Sequelize)
db.city.belongsTo(db.country);
db.cityarea.belongsTo(db.city);
db.station.belongsTo(db.cityarea);
db.transportationvehicle.belongsTo(db.transportationtype);
db.routestation.belongsTo(db.station);
db.routestation.belongsTo(db.route);
db.routestation.belongsTo(db.transportationvehicle);
db.station.belongsToMany(db.routestation, {through: 'Stationroutes', foreignKey: 'StationId', as: 'stations'});
db.route.belongsToMany(db.routestation, {through: 'Stationroutes', foreignKey: 'RouteId', as: 'routes'});
db.transportationvehicle.belongsToMany(db.routestation, {through: 'Stationroutes', foreignKey: 'TransportationVehicleId', as: 'vehicles'});

module.exports = db;