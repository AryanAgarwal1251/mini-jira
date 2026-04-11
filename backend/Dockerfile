# Use official Node image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the code
COPY . .

# Expose backend port
EXPOSE 5000

# Environment variables (important for auth + mongo)
ENV PORT=5000

# Start server
CMD ["npm", "run", "dev"]