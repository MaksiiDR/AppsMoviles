FROM node:20-alpine

# Directorio de trabajo en el contenedor
WORKDIR /app

# Copiamos primero los archivos de dependencias para aprovechar el cache de Docker
COPY package.json package-lock.json ./

# Instalamos las dependencias
RUN npm ci

# Instalamos ngrok globalmente para permitir el tunnel de Expo (como lo hizo el ayudante)
RUN npm install -g @expo/ngrok

# Copiamos el resto de la aplicación
COPY . .

# Exponemos el puerto de Metro Bundler
EXPOSE 8081

# Iniciamos el servidor de desarrollo con tunnel
CMD ["npx", "expo", "start", "--tunnel"]
