# Система управления обращениями

![alt text](https://github.com/muddinit/ticket-management-system/blob/main/images/app.png)


## Обзор

Это приложение представляет собой систему управления обращениями, которая позволяет пользователям создавать, управлять и отслеживать обращения. Каждое обращение может иметь различные статусы, и система предоставляет эндпоинты для создания обращений, взятия их в работу, завершения, отмены и получения списка обращений с возможностью фильтрации.

## Используемые технологии

- **Node.js**: JavaScript-окружение для создания серверного приложения.
- **Express.js**: Веб-фреймворк для создания RESTful API.
- **Sequelize**: ORM для взаимодействия с базой данных.
- **MySQL**: Реляционная база данных для хранения информации об обращениях.
- **TypeScript**: Надстройка над JavaScript для обеспечения типизации (опционально, можно использовать обычный JavaScript).

## Функции

- Создание нового обращения с темой и текстом.
- Взятие обращения в работу.
- Завершение обращения с текстом решения.
- Отмена обращения с указанием причины.
- Получение списка обращений с возможностью фильтрации по дате или диапазону дат.
- Отмена всех обращений, которые находятся в статусе "в работе".

## API Эндпоинты

### 1. Получить список обращений

- **Эндпоинт**: `GET /api/tickets`

- **curl команда**: 
```sh
curl -X GET http://localhost:3000/api/tickets/get-tickets
```

### 2. Создать обращение

- **Эндпоинт**: `POST /api/tickets`
- **Тело запроса**:
  ```json
  {
    "subject": "Тема обращения",
    "message": "Описание проблемы."
  }
  
- **curl команда**: 
```sh
curl -X POST http://localhost:3000/api/tickets/create \
-H "Content-Type: application/json" \
-d '{"subject": "Тема обращения", "message": "Описание проблемы."}
```

### 3. Отфильтровать обращения по дате

- **Эндпоинт**: `POST /api/tickets/filter`

- **Тело запроса**:

  ```json
  {
  "startDate": "2023-10-05",
  "endDate": "2023-10-10" 
  }

- **Параметры запроса**:
    startDate: Фильтрация обращений, созданных с этой даты.
    endDate: Фильтрация обращений, созданных до этой даты, опционально.

- **curl команда**: 
```sh
curl -X POST http://localhost:3000/api/tickets/filter \
-H "Content-Type: application/json" \
-d '{"startDate": "2023-10-05", "endDate": "2023-10-10"}'
```

### 4. Взять обращение в работу

- **Эндпоинт**: ``PUT /api/tickets/take/``

- **Тело запроса**:
  ```json
  {
  "id": 1
  }
  
- **curl команда**: 
```sh
curl -X PUT http://localhost:3000/api/tickets/take \
-H "Content-Type: application/json" \
-d '{"id": 1}'
```

### 5. Завершить обращение

- **Эндпоинт**: `PUT /api/tickets/:id/complete`

- **Тело запроса**:
    ```json
  {
    "id": 1,
    "completeReason": "Обращение исполнено."
  }

- **curl команда**: 
```sh
curl -X PUT http://localhost:3000/api/tickets/complete \
-H "Content-Type: application/json" \
-d '{"id": 1, "completeReason": "Обращение исполнено."}'
```  

### 6. Отмена обращения

- **Эндпоинт** : `PUT /api/tickets/:id/cancel`

- **Тело запроса**:
    ```json
  {
    "id": 1,
    "cancelReason": "Причина отмены."
  }

- **curl команда**: 
```sh
curl -X PUT http://localhost:3000/api/tickets/cancel \
-H "Content-Type: application/json" \
-d '{"id": 1, "cancelReason": "Причина отмены."}'
``` 



### 7. Отмена всех обращений, которые находятся в статусе "в работе".

- **Эндпоинт**: `DELETE /api/tickets/cancel-all`

- **curl команда**: 
```sh 
curl -X DELETE http://localhost:3000/api/tickets/cancel
```  

## Инструкции по настройке

### Предварительные требования
- Node.js (версия 14 или выше)
- Docker
- Git

### Клонирование репозитория,установка зависимостей и запуск приложения
```sh
git clone <repository-url>
cd ticket-management-system
docker-compose up --build
```

### Запуск приложения
Приложение будет запущено на localhost. Frontend на localhost:8080, Api localhost:3000

### Подробная проверка API

### Выводим все обращения

```sh 
curl -X GET http://localhost:3000/api/tickets/get-tickets
```

### Создаем обращение

```sh
curl -X POST http://localhost:3000/api/tickets/create \
-H "Content-Type: application/json" \
-d '{"subject": "Тема обращения", "message": "Описание проблемы."}
```

### Фильтруем по дате

```sh
curl -X POST http://localhost:3000/api/tickets/filter \
-H "Content-Type: application/json" \
-d '{"startDate": "2023-10-05", "endDate": "2023-10-10"}'
```

### Ставим статус обращения на работу

```sh
curl -X PUT http://localhost:3000/api/tickets/take \
-H "Content-Type: application/json" \
-d '{"id": bcbaf779-0091-4043-908f-490a57a3e4b9}'
```

### Завершаем обращение

```sh
curl -X PUT http://localhost:3000/api/tickets/complete \
-H "Content-Type: application/json" \
-d '{"id": bcbaf779-0091-4043-908f-490a57a3e4b9, "completeReason": "Обращение исполнено."}'
```  
### Отменяем другое обращение

```sh
curl -X PUT http://localhost:3000/api/tickets/cancel \
-H "Content-Type: application/json" \
-d '{"id": 75592045-cc3c-4736-a84a-41db4dd584be, "cancelReason": "Причина отмены."}'
``` 

### Отмена всех обращений, которые находятся в статусе "в работе"

```sh 
curl -X DELETE http://localhost:3000/api/tickets/cancel-all
```  
