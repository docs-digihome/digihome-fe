ARG BUN_VERSION=1.2-alpine
ARG NGINX_VERSION=1.28.0-alpine-slim

FROM oven/bun:${BUN_VERSION} AS builder
WORKDIR /app
COPY package.json bun.lock bunfig.toml ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM nginx:${NGINX_VERSION} AS production
RUN apk add --no-cache gettext
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY public/config.template.js /usr/share/nginx/html/config.template.js
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
