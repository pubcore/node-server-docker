FROM node:8.11.1

ARG PACKAGE_REGISTRY_URI=https://registry.npmjs.org/
ARG APP_PORT=8443

ENV APP_WORKDIR=/home/node/app
ENV	APP_PORT=$APP_PORT
ENV NODE_ENV=production

USER node

RUN mkdir $APP_WORKDIR
WORKDIR $APP_WORKDIR

COPY *-shrinkwrap.json package.json server.js ${APP_WORKDIR}/
RUN echo "set npm's package registry: $PACKAGE_REGISTRY_URI, " \
	&& npm config set registry $PACKAGE_REGISTRY_URI \
	&& NODE_ENV=production npm install

EXPOSE $APP_PORT
CMD ["node", "server.js"]
