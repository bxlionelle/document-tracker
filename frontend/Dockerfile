# Use Debian-based Node image (not Alpine)
FROM node:20

# Set working directory
WORKDIR /app

# Copy dependency files first
COPY package*.json ./

# Install dependencies cleanly
RUN npm install --legacy-peer-deps

# Copy the rest of the app
COPY . .

# Expose frontend port
EXPOSE 3000

# Run Vite dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
