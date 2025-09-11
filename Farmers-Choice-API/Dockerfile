# Farmers-Choice-API/Dockerfile
FROM node:18-slim

WORKDIR /app

# Copy lockfiles first to leverage Docker cache
COPY package*.json ./
RUN npm ci --silent

# Copy source, build and remove dev-only modules if needed
COPY . .

# Build TypeScript to dist/
RUN npm run build

EXPOSE 3000

# Run the compiled application
CMD ["npm", "start"]
