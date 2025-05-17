# Removarr

## Installation

Define the removarr service in your `compose.yaml` as follows:

> change `/path/to/config` with your custom directory path

```yaml
services:
  removarr:
    container_name: removarr
    image: tphilippot/removarr:latest
    ports:
      - 3000:3000
    volumes:
      - /path/to/config:/app/config
```

The starts the service

`docker compose up -d`

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm install
npm run dev

# pnpm
pnpm install
pnpm dev

# yarn
yarn install
yarn dev

# bun
bun install
bun run dev
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
