const { MikroORM, LoadStrategy } = require('@mikro-orm/core');

const DI = {};
module.exports.DI = DI;

(async () => {
    DI.orm = await MikroORM.init();
    DI.em = DI.orm.em;
})();
