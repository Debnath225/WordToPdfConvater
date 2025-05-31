FROM node:20-bullseye

# Install LibreOffice
RUN apt-get update && apt-get install -y libreoffice

WORKDIR /app
COPY . .
RUN npm install

EXPOSE 5000
CMD ["node", "server.js"]
