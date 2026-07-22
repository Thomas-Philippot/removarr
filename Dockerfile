FROM node:22.15.0-alpine AS build

LABEL authors="Thomas Philippot"

ARG PORT=3000

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . ./

RUN npm run build

FROM node:22.15.0-alpine AS prod

USER node

WORKDIR /app

ENV HOST=0.0.0.0
ENV NODE_ENV=production

COPY --from=build /app/.output ./.output
COPY --from=build /app/config ./config
COPY --from=build /app/server ./server

HEALTHCHECK --interval=10s --timeout=20s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://0.0.0.0:3000 || exit 1

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
