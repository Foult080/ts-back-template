# stage-1: build project
FROM node:20-alpine as builder

ARG APP_DIR=/usr/src/app

WORKDIR ${APP_DIR}

COPY package*.json ${APP_DIR}

RUN npm install

COPY . ${APP_DIR}

RUN npm run build

#stage-2: run app
FROM node:20-alpine

ARG APP_DIR=/usr/src/app

WORKDIR ${APP_DIR}

COPY --from=builder ${APP_DIR}/package*.json {APP_DIR}

COPY --from=builder ${APP_DIR}/build/ {APP_DIR}

RUN npm install --omit=dev

CMD ["npm", "start"]

