FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx tsc

FROM node:18 AS production

WORKDIR /app

COPY --from=builder /app/dist ./dist

COPY --from=builder /app/package*.json ./

RUN npm install --only=production

COPY ./src/config ./config

COPY ./src/migrations ./migrations

COPY ./src/seeders ./seeders

EXPOSE 3000

CMD node dist/app.prod.js  