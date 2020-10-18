  const Country = require('./country.js').Country;

const { Model } = require('objection');

class City extends Model{
    static get tableName(){
        return 'city';
    }

    static relationMappings = {
        Country: {
            relation: Model.BelongsToOneRelation,
            modelClass: Country,
            join:{
                from: 'city.CountryId',
                to: 'country.Id'
            }
        }
    }
}

module.exports.City = City;