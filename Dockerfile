FROM node:18.18.1

WORKDIR /app

COPY package*.json ./

RUN npm install --frozen-lockfile

COPY . .

EXPOSE 5000

CMD ["node", "src/index.js"]
