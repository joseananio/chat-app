FROM node:14

WORKDIR /usr/src/app/api

# RUN npm i -g yarn
# RUN useradd -m runner --uid=1000 && echo "${USER}:${PW}" | \
#       chpasswd
# USER 1000:1000
RUN echo $UID
RUN whoami
RUN npm i -g npmrc
RUN npmrc -c default
RUN npmrc default
COPY  .npmrc /usr/src/app/api/.npmrc

COPY package*.json ./

RUN yarn

EXPOSE 3001
EXPOSE 8443


CMD ["npm", "run", "start"]