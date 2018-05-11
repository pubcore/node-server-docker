FROM node:8.11.1-alpine

ENV SERVICE_PORT 8443
ENV APP_WORKDIR=/home/node/app

RUN npm install -g nodemon

RUN mkdir $APP_WORKDIR

USER node

WORKDIR $APP_WORKDIR

EXPOSE $SERVICE_PORT
EXPOSE 9229

CMD ["nodemon", "-L", "--inspect=0.0.0.0:9229", "--trace-sync-io", "server.js"]
