FROM node:16.7-alpine

WORKDIR "/server"

COPY ./package.json .

COPY ./package-lock.json .

RUN npm install

RUN npm install -g sequelize-cli

COPY . .

EXPOSE 4000

COPY ./docker-entrypoint-prod.sh /docker-entrypoint-prod.sh

RUN chmod +x /docker-entrypoint-prod.sh

ENTRYPOINT ["/docker-entrypoint-prod.sh"]