FROM node:22-alpine AS builder
WORKDIR /app

ARG API_BASE_URL=http://localhost:8080
ENV API_BASE_URL=${API_BASE_URL}

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
