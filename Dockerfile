FROM node:16

WORKDIR /campusevent-backend

COPY package.json .

RUN npm install

COPY . .

CMD ["npm", "start"]
