FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY client/package*.json ./client/
RUN npm install --prefix client

COPY server/package*.json ./server/
RUN npm install --prefix server

# Copy source files
COPY client/ ./client/
COPY server/ ./server/

# Build React app
RUN npm run build --prefix client

EXPOSE 3001

CMD ["node", "server/index.js"]
