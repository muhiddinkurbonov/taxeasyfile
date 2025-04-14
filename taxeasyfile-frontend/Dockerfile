# Build stage
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY .env .  
RUN npm install
COPY . .
ENV NODE_ENV=production
RUN npm run build

# Serve stage
FROM nginx:1.25.3-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
