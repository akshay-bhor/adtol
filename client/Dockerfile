FROM node:16.7-alpine as build

WORKDIR "/client"

COPY ./package.json .

COPY ./yarn.lock .

RUN yarn install

COPY . .

RUN yarn build

RUN yarn export

FROM nginx
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /client/out /usr/share/nginx/html
