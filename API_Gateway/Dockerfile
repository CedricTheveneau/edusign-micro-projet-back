FROM node:20.19.6-alpine3.22

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 8080

CMD [ "npm", "run", "start" ]