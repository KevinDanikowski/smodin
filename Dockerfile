FROM node

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app
RUN npm install
RUN npm install serve -g
COPY . /usr/src/app
RUN npm run build

EXPOSE 3000
RUN serve -s -p 3000 build