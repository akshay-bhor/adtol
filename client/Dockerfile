FROM node:alpine as build

WORKDIR "/client"

COPY ./package.json/ ./

COPY ./yarn.lock/ ./

RUN yarn install

COPY . .

RUN yarn build

FROM nginx
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /client/build /usr/share/nginx/html
