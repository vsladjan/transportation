const config = require('./config.json');

const dbConfig = {
	client: 'mysql',
  connection: {
    host     : 'localhost',
    user     : config.db_username,
    password : config.db_password,
    database : 'transportation',
    charset  : 'utf8'
  }
};

var knex;

var createConection = function(){
    knex = require('knex')(dbConfig);
}


var getConnection = function(){
   return knex;
}


module.exports.createConection = createConection;
module.exports.getConnection = getConnection;