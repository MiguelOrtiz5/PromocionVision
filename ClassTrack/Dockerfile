# Usa una imagen base específica de Node.js (v20.17.0)
FROM node:20.17.0

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia el package.json y el package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install --verbose

# Copia el resto de la aplicación
COPY . .

# Expone el puerto en el que la aplicación correrá
EXPOSE 8081

# Comando para correr la aplicación
RUN npm run build

CMD ["npm", "run", "start"]