FROM node:22-bookworm-slim AS build

WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.26.1 --activate

COPY . .
RUN pnpm install --frozen-lockfile

ENV PORT=5173
ENV BASE_PATH=/

RUN pnpm --filter @workspace/bianco-restaurant run build

FROM nginx:1.27-alpine AS runtime

COPY nginx.static.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/artifacts/bianco-restaurant/dist/public /usr/share/nginx/html

EXPOSE 80
