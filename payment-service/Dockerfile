# Dockerfile for Payment Service
FROM node:14

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port
EXPOSE 8081

# Command to run the application
CMD ["npm", "start"]
