FROM node:16.7-alpine

WORKDIR "/worker"

COPY ./package.json .

COPY ./package-lock.json .

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "start"]