const Sequelize = require('sequelize');
const config = require('./config.json');

const sequelize = new Sequelize('transportation', config.db_username, config.db_password, {
    host: 'localhost',
    dialect: 'mysql',
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
db.country = require('./models/country.js')(sequelize, Sequelize)
db.city = require('./models/city.js')(sequelize, Sequelize)
db.cityarea = require('./models/cityarea.js')(sequelize, Sequelize)
db.station = require('./models/station.js')(sequelize, Sequelize)
db.transportationtype = require('./models/transportationtype.js')(sequelize, Sequelize)
db.transportationvehicle = require('./models/transportationvehicle.js')(sequelize, Sequelize)
db.city.belongsTo(db.country);
db.cityarea.belongsTo(db.city);
db.station.belongsTo(db.cityarea);
db.transportationvehicle.belongsTo(db.transportationtype);

module.exports = db;