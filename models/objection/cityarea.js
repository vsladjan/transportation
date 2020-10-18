const City = require('./city.js').City;

const {Model} = require('objection');

class Cityarea extends Model{
    static get tableName(){
        return 'cityarea';
    }

    static relationMappings = {
        City: {
            relation: Model.BelongsToOneRelation,
            modelClass: City,
            join: {
                from: 'cityarea.CityId',
                to: 'city.Id'
            }
        }
    }
}


module.exports.Cityarea = Cityarea;