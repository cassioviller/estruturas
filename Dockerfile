# Stage 1: build do client e bundle do servidor
FROM node:18-alpine AS builder

WORKDIR /app

# Copia só package.json e lockfiles e instala deps
COPY package.json package-lock.json ./
COPY client/package.json client/package-lock.json client/
RUN npm ci

# Copia todo o código e faz o build
COPY . .
RUN npm run build

# Stage 2: imagem final enxuta
FROM node:18-alpine

WORKDIR /app

# Apenas deps de produção
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copia build gerado
COPY --from=builder /app/dist ./dist

# Expõe a porta configurada no seu app (o EasyPanel vai usar PORT)
EXPOSE 5000

# Comando padrão
CMD ["node", "dist/index.js"]
