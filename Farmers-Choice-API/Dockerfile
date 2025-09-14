# Farmers-Choice-API/Dockerfile
FROM node:18-slim

WORKDIR /app

# Copy lockfiles first to leverage Docker cache
COPY package*.json ./
RUN npm ci --silent

# Copy only source and scripts explicitly (avoid relying on .dockerignore)
COPY src ./src
COPY scripts ./scripts

# Copy the rest of the project (config, tsconfig, etc.)
COPY . .

# Build TypeScript to dist/
RUN npm run build

EXPOSE 3000

# Run the compiled application
CMD ["npm", "start"]
# Use npm start to run the application
# Copy seed JSON files from Farmers-Choice-FrontEnd
COPY ./seedData ./seedData
