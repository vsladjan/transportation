const { Model } = require('objection');

class Transportationtype extends Model{
    static get tableName(){
        return 'transportationtype';
    }
}

module.exports.Transportationtype = Transportationtype;