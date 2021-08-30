FROM node:14

WORKDIR /usr/src/app/api

COPY package*.json ./
RUN yarn

COPY . .
# define variables in docker compose
RUN rm .env

RUN yarn build

EXPOSE 80
EXPOSE 443


CMD ["npm", "run", "start"]