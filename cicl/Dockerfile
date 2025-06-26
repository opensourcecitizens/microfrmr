# Dockerfile

# Use an official Node.js runtime as a parent image
FROM node:14-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and yarn.lock files to the working directory
#COPY package.json yarn.lock ./
ADD ./package.json ./
#ADD ./package-lock.json ./

# Install app dependencies
RUN yarn install --frozen-lockfile

# Copy the entire app directory to the working directory
COPY .. .

# Build the app for production
RUN npx react-native bundle --platform ios --dev false --entry-file index.js --bundle-output ios/main.jsbundle --assets-dest ios/assets
RUN npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

# Expose port 8080 for the React Native packager
EXPOSE 8080

# Start the app
CMD ["npx", "react-native", "start"]
