FROM node:20.20.0-alpine3.22

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 8081

CMD [ "npm", "run", "start" ]