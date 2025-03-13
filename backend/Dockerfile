# Usa una imagen base oficial de Node.js
FROM node:lts

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia el package.json y el package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN yarn install

# Define un volumen
VOLUME ["/db"]

# Copia el resto de la aplicación
COPY . .

# Expone el puerto en el que la aplicación correrá
EXPOSE 3000

# Comando para compilar y correr la aplicación
RUN yarn build

CMD ["yarn", "dev"]