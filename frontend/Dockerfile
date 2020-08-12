FROM node:12

WORKDIR /code/frontend

# add `/app/node_modules/.bin` to $PATH
ENV PATH /code/frontend/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./

RUN npm install --silent
