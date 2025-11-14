FROM node:20-alpine AS builder

RUN apk add --no-cache python3 py3-pip

WORKDIR /app

COPY package*.json ./
COPY mkdocs.yml ./

RUN npm ci
RUN pip3 install --break-system-packages mkdocs

COPY . .

RUN npm run build:typograf

FROM nginx:alpine

COPY --from=builder /app/site /usr/share/nginx/html

RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
