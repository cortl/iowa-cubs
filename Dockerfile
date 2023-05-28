FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV production

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "start"]