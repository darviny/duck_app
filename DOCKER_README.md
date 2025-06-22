# Docker Setup for Duck App

This guide will help you run the Duck App project on any computer using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose (usually comes with Docker Desktop)

## Quick Start

### Production Build (Recommended for deployment)

1. **Build and run the production version:**
   ```bash
   docker-compose --profile prod up --build
   ```
   The app will be available at `http://localhost:80`

2. **Or use a custom port:**
   ```bash
   docker-compose --profile prod-custom up --build
   ```
   The app will be available at `http://localhost:3000`

### Development Build (For development with hot reloading)

1. **Build and run the development version:**
   ```bash
   docker-compose --profile dev up --build
   ```
   The app will be available at `http://localhost:5173`

## Alternative Docker Commands

### Using Docker directly (without docker-compose)

**Production:**
```bash
# Build the image
docker build -t duck-app .

# Run the container
docker run -p 80:80 duck-app
```

**Development:**
```bash
# Build the development image
docker build -f Dockerfile.dev -t duck-app-dev .

# Run the development container
docker run -p 5173:5173 -v $(pwd):/app duck-app-dev
```

## Stopping the Application

- **With docker-compose:** `docker-compose down`
- **With docker:** `docker stop <container_id>`

## Useful Commands

### View running containers
```bash
docker ps
```

### View logs
```bash
# With docker-compose
docker-compose logs -f

# With docker
docker logs <container_id>
```

### Access container shell
```bash
# With docker-compose
docker-compose exec duck-app sh

# With docker
docker exec -it <container_id> sh
```

### Remove all containers and images
```bash
docker system prune -a
```

## Troubleshooting

### Port already in use
If you get an error about port 80 or 5173 being in use:
- Change the port mapping in `docker-compose.yml`
- Or stop the service using that port

### Build fails
- Make sure all files are present in the project directory
- Check that `package.json` and `package-lock.json` exist
- Try running `docker system prune` to clear cache

### Hot reloading not working in development
- Make sure you're using the development profile: `--profile dev`
- Check that the volume mount is working correctly
- Verify the Vite configuration in `vite.config.ts`

## Environment Variables

The application uses environment variables for configuration. You can set them in the `docker-compose.yml` file or pass them when running docker commands.

## File Structure

- `Dockerfile` - Production build configuration
- `Dockerfile.dev` - Development build configuration
- `docker-compose.yml` - Multi-service orchestration
- `nginx.conf` - Nginx configuration for production
- `.dockerignore` - Files to exclude from Docker build

## Performance Tips

- Use the production build for deployment (smaller image size)
- Use the development build only for development (includes dev dependencies)
- The production build uses nginx for better performance
- Static assets are cached for better performance

## Security Notes

- The production build runs as a non-root user
- Security headers are configured in nginx
- Only necessary files are included in the Docker image 