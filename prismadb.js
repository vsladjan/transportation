var client = require('@prisma/client');
var {PrismaClient} = client;
var prisma;

var createConection = function(){
    prisma = new PrismaClient();
}


var getConnection = function(){
   return prisma;
}


module.exports.createConection = createConection;
module.exports.getConnection = getConnection;