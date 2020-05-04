FROM node:10-alpine

ARG NODE_ENV=production

RUN echo ${NODE_ENV}

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/
RUN yarn install

# Set environment variables
ENV NUXT_HOST 0.0.0.0
ENV NUXT_PORT 3020

# Bundle app source
COPY . /usr/src/app
RUN yarn build

# Clear the cache
RUN yarn cache clean

EXPOSE 3020
CMD [ "yarn", "start" ]
