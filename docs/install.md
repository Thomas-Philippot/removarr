# Installation

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
