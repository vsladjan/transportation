const { Model } = require('objection');
   
// Defining models
class Country extends Model{
    static get tableName(){
        return 'country';
    }
}


module.exports.Country = Country;