# Use a Node.js image to build the app
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
ARG API_BASE_URL
ARG FRONT_BASE_URL
RUN npm run build

# Use a new image to serve the built application
FROM node:18-alpine

WORKDIR /app

# Install serve to serve the built static files
RUN npm install -g serve

# Copy the build artifacts from the builder stage
COPY --from=builder /app/dist /app

# Set environment variable for the port
ENV PORT 80

# Expose the port
EXPOSE $PORT

# Serve the application
CMD ["serve", "-s", ".", "-l", "$PORT"]
