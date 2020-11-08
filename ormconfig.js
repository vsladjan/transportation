var config = require("./config.json");

module.exports = {
    "type": "mysql",
    "host": "localhost",
    "port": 3306,
    "username": config.db_username,
    "password": config.db_password,
    "database": "transportation",
    "synchronize": true,
    "entities": [
       "models/typeorm/entities/**/*.js"
    ]
}
