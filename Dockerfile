FROM node:16.8-alpine AS builder

ENV NODE_ENV development

WORKDIR /app

COPY package-lock.json .
COPY package.json ./
RUN yarn install

COPY * .

EXPOSE 3000
ENV port 3000

CMD [ "yarn", "start" ]
# CMD sleep infinity