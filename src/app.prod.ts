import express from 'express';
import bodyParser from 'body-parser';
import sequelize from './database/database'; // Ensure this imports the Sequelize instance
import ticketRoutes from './routes/ticketRoutes';
import path from 'path';
import cors from 'cors';
import { exec } from 'child_process';

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/api', ticketRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); // Фронтенд
});

// Миграция
const runMigrations = async () => {
  return new Promise((resolve, reject) => {
    exec('npx sequelize-cli db:migrate --env production', (error, stdout, stderr) => {
      if (error) {
        console.error(`Ошибка при миграций: ${stderr}`);
        reject(error);
      } else {
        console.log(`Миграция выполнена: ${stdout}`);
        resolve(stdout);
      }
    });
  });
};

//Заполняем данными
const runSeeders = async () => {
  return new Promise((resolve, reject) => {
    exec('npx sequelize-cli db:seed:all --env production', (error, stdout, stderr) => {
      if (error) {
        console.error(`Ошибка при сидировании: ${stderr}`);
        reject(error);
      } else {
        console.log(`Сидирование завершено: ${stdout}`);
        resolve(stdout);
      }
    });
  });
};

const startServer = async () => {
  try {
    await runMigrations();
	await runSeeders();
    await sequelize.sync();
	console.log('Связь с базой данных установлена.');
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
    });
  } catch (error) {
    console.error('Ошибка при подключении к базе данных:', error);
  }
};

startServer();