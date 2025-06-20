# Use Node.js 18 as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache git python3 make g++

# Copy package files
COPY package*.json ./
COPY amplify/package.json ./amplify/

# Install dependencies
RUN npm install
RUN cd amplify && npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Create startup script
RUN echo '#!/bin/sh\n\
echo "Starting Amplify backend..."\n\
npx @aws-amplify/backend-cli dev &\n\
sleep 10\n\
echo "Starting frontend..."\n\
npm run dev -- --host 0.0.0.0 --port 3000\n\
' > /app/start.sh && chmod +x /app/start.sh

# Start the application
CMD ["/app/start.sh"] 