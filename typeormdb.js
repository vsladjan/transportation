var { DataSource } = require("typeorm");
var ormConfig = require("./ormconfig.js");

let AppDataSource;

module.exports.createConnection = (async function(){
    
    AppDataSource = new DataSource(
        ormConfig
    );
    await AppDataSource.initialize();
    return AppDataSource;
});


module.exports.getConnection = function(){
    return AppDataSource;
}