# frontend/Dockerfile

FROM node:20-slim

WORKDIR /app

# Ensure clean install
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose Vite port
EXPOSE 5173

# Run the dev server with host binding
CMD ["npm", "run", "dev", "--", "--host"]
