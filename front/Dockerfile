FROM node:18-bullseye-slim

RUN mkdir -p /app
COPY . /app

WORKDIR /app

RUN npm install
EXPOSE 3000

CMD ["npm", "run", "dev"]