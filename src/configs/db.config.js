import { config } from 'dotenv';
import { Sequelize } from 'sequelize';
config();

export const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME,
  dialect: 'postgres',
  logging: false,
  sync: {
    alter: true,
  },
});

export const authenticateDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to the database successfully');
  } catch (error) {
    console.log('Error connecting to the database', error);
    process.exit(1);
  }
};
