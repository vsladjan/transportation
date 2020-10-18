const { Model } = require('objection');

class Route extends Model{
    static get tableName(){
        return 'route';
    }
}

module.exports.Route = Route;