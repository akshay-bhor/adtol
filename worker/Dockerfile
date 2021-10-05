FROM node:16.7-alpine

WORKDIR "/worker"

COPY ./package.json .

COPY ./package-lock.json .

RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "start"]