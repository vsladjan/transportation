var getOrm = function(req, res){
    var cookie = req.cookies['orm'];
    var orm;
    if ( typeof cookie !== 'undefined' && cookie ){
        orm = cookie;
    }else{
        orm = 'Sequelize';
    }
    return orm;
}

module.exports.getOrm = getOrm;