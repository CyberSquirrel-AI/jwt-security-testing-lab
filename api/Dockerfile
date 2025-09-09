FROM node:20-alpine

WORKDIR /app

# Copy only package manifests first for better layer caching
COPY package*.json ./

# Install prod deps (omit dev), no audit/fund for speed/noise
RUN npm install --omit=dev --no-audit --no-fund

# Now copy the rest of the app
COPY . .

EXPOSE 8080
CMD ["node","server.js"]
