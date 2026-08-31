ARG BUN_VERSION=1.2-alpine
ARG NGINX_VERSION=stable-alpine

FROM oven/bun:${BUN_VERSION} AS builder
WORKDIR /app
COPY package.json bun.lock bunfig.toml ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM nginx:${NGINX_VERSION} AS production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
