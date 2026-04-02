FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm config set registry https://registry.npmjs.org/ \
 && npm install

COPY . .

ENV NODE_ENV=production

EXPOSE 3000

CMD ["sh", "-c", "npm run migrate up && node src/app.js"]