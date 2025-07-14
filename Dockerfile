FROM node:18

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 19006

CMD ["npm", "run", "web"]