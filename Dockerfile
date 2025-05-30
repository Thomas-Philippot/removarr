FROM node:22.15.0-alpine AS build

LABEL authors="Thomas Philippot"

ARG PORT=3000

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . ./

RUN npm run build

FROM node:22.15.0-alpine AS prod

WORKDIR /app

ENV HOST=0.0.0.0
ENV PORT=$PORT
ENV NODE_ENV=production

COPY --from=build /app/.output ./.output
COPY --from=build /app/config ./config
COPY --from=build /app/server ./server

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
