from node:14-alpine as build

WORKDIR /app

copy package.*json .

Run NPM install

COPY . .

CMD ["npm ", "start"]

from nginx:1.19

copy /nginx/nginx.conf /etc/nginx/nginx.conf


