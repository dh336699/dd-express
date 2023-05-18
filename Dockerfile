FROM ubuntu:22.04

RUN apt-get update && apt-get install -y nodejs npm

# 设置 Node.js 和 npm 的软链接
RUN ln -s /usr/bin/nodejs /usr/bin/node

COPY . /www

WORKDIR /www

RUN npm install

CMD ["npm", "run", "dev"]

EXPOSE 443