FROM node:14

WORKDIR /usr/src/app/my-app

COPY package*.json ./

RUN yarn global add serve

RUN yarn

COPY . .
COPY ./src/env.prod.json ./src/env.json

RUN yarn build

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "tcp://0.0.0.0:3000"]