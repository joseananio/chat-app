FROM node:14

WORKDIR /usr/src/app/my-app

COPY package*.json ./

COPY . .

RUN yarn

EXPOSE 3000

CMD ["npm", "start"]