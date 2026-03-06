FROM node:20-alpine

WORKDIR /app

# Copy all files first
COPY . .

# Install dependencies (this triggers postinstall -> build)
RUN npm install

# Expose port
EXPOSE 8080

# Run production server
CMD ["node", "server.js"]
