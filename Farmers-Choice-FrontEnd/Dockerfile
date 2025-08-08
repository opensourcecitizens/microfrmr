FROM node:18

WORKDIR /app

COPY package*.json ./
COPY . .

RUN npm install --legacy-peer-deps

EXPOSE 19006

CMD ["npx", "expo", "start", "--web"]