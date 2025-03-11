import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: '',
  database: process.env.DB_NAME,
  dialect: 'postgres',
  logging: false,
  sync: {
    alter: true,
  },
});

const authenticateDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to the database successfully');
  } catch (error) {
    console.log('Error connecting to the database', error);
    process.exit(1);
  }
};
export { sequelize, authenticateDB };
