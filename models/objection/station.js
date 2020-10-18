const Cityarea = require('./cityarea.js').Cityarea;

const { Model } = require('objection');

class Station extends Model{
    static get tableName(){
        return 'station';
    }

    static relationMappings = {
        Cityarea: {
            relation: Model.BelongsToOneRelation,
            modelClass: Cityarea,
            join:{
                from: 'station.CityAreaId',
                to: 'cityarea.Id'
            }
        }
    }
}

module.exports.Station = Station;