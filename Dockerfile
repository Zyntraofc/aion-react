# Etapa 1: Build
FROM node:18 AS build

WORKDIR /app

# Copiar package.json e instalar dependências
COPY package*.json ./
RUN npm install

# Copiar todo o código e buildar
COPY . .
RUN npm run build

# Etapa 2: Servir os arquivos estáticos
FROM nginx:alpine

# Copia o build para a pasta padrão do nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expor a porta 80
EXPOSE 80

# Comando de inicialização
CMD ["nginx", "-g", "daemon off;"]
