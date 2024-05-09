FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

ENV OPEN_AI_KEY=$OPEN_AI_KEY

RUN pnpm run build

CMD [ "pnpm", "run", "start" ]