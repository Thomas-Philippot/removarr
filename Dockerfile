FROM node:22.15.0-alpine AS build

LABEL authors="Thomas Philippot"

ARG PORT=3000

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . ./

RUN npm run build

FROM build

WORKDIR /app

ENV HOST=0.0.0.0
ENV PORT=$PORT
ENV NODE_ENV=production

COPY --from=build /app ./

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
