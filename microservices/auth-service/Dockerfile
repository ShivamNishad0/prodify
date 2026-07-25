FROM node:18-alpine

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the application
COPY . .

# Expose the port Express runs on (assuming 5000, adjust if different in server.js)
EXPOSE 5000

# Start the Node.js server
CMD ["npm", "start"]
