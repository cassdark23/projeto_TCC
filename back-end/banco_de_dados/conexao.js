const {Sequelize} = require('sequelize');

const sequelize = new Sequelize ('fox_arena', 'root','root', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    logging: false,
}); 

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Conexão com o MySQL estabelecida com sucesso!');
    } catch (error) {
        console.error('Erro ao conectar com o MySQL: ', error)
    }
} 

testConnection();
module.exports = sequelize;
