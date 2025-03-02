import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('prod_db', 'prod_user', 'prod_password', {
  host: 'prod_db',
  dialect: 'mysql',
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Связь с базой данных установлена успешно');
  } catch (error) {
    console.error('Невозможно связаться с базой данных', error);
  }
}

testConnection();

export default sequelize;