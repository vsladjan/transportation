const config = require('./config.json');
const { Model } = require('objection');

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
  Model.knex(knex);
}



module.exports.createConection = createConection;