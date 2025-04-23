# Set the base image for Node.js
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
COPY tsconfig.json ./
RUN npm install


# Copy the rest of the application code
COPY . .

# Build TypeScript
RUN npm run build

# Expose the API port (adjust the port if necessary)
EXPOSE 3000

# Start the API server
CMD ["npm", "start"]
