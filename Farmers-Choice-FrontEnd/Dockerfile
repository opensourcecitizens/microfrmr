# Farmers-Choice-FrontEnd/Dockerfile
FROM node:20-slim

WORKDIR /app

# Copy package files and install deps
COPY package*.json ./
RUN npm ci --legacy-peer-deps --silent

# Install global expo CLI for "expo" command
RUN npm install -g expo-cli

# Copy project files
COPY . .

EXPOSE 19006

# Use the "web" script (ensure package.json has "web": "expo start --web")
CMD ["npm", "run", "web"]
