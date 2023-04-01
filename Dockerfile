FROM node:16.8-alpine AS builder

ENV NODE_ENV development

WORKDIR /app

COPY package-lock.json .
COPY package.json ./
RUN npm install

COPY ./* /app/

EXPOSE 3000
ENV port 3000

CMD [ "npm", "start" ]
# CMD sleep infinity