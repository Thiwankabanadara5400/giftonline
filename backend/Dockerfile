FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p uploads/products

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "src/server.js"]
