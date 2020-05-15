FROM node:12.16.3-alpine
ENV NODE_ENV=production

RUN deluser --remove-home node \
   && addgroup -S node -g 500 \
   && adduser -S -g node -u 500 node

ENV APP_WORKDIR=/home/node/app
USER node
RUN mkdir /home/node/app
WORKDIR /home/node/app
COPY . .
CMD ["node", "server.js"]
