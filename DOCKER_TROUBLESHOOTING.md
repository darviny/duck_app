# Docker Troubleshooting Guide

This guide helps you resolve common issues when running the Duck App with Docker.

## Issue 1: Node.js Version Compatibility

### Problem:
```
npm warn EBADENGINE Unsupported engine {
  package: 'react-router-dom@7.6.2',
  required: { node: '>=20.0.0' },
  current: { node: 'v18.20.8', npm: '10.8.2' }
}
```

### Solution:
The project requires Node.js 20 or higher. The Dockerfiles have been updated to use Node.js 20.

**Try this command:**
```bash
docker-compose --profile prod up --build
```

## Issue 2: Husky Prepare Script Error

### Problem:
```
sh: husky: not found
npm error code 127
```

### Solution:
This happens because husky (a git hook tool) tries to run during production install. The Dockerfiles now install all dependencies including dev dependencies for the build stage.

**Try this command:**
```bash
docker-compose --profile prod up --build
```

## Issue 3: Alternative Production Build

If the main production build still fails, try the alternative production build:

```bash
docker-compose --profile prod-alt up --build
```

Then visit: `http://localhost:8080`

## Issue 4: Development Build Issues

For development with hot reloading:

```bash
docker-compose --profile dev up --build
```

Then visit: `http://localhost:5173`

## Issue 5: Port Conflicts

### If port 80 is in use:
```bash
docker-compose --profile prod-custom up --build
```
Visit: `http://localhost:3000`

### If port 3000 is also in use:
```bash
docker-compose --profile prod-alt up --build
```
Visit: `http://localhost:8080`

## Issue 6: Build Cache Problems

If you're getting strange build errors, clear the Docker cache:

```bash
# Stop all containers
docker-compose down

# Remove all images and containers
docker system prune -a

# Rebuild from scratch
docker-compose --profile prod up --build
```

## Issue 7: AWS Amplify Dependencies

### Problem:
```
npm warn ERESOLVE overriding peer dependency
```

### Solution:
This is a warning, not an error. AWS Amplify packages sometimes have peer dependency conflicts, but they usually work fine. If the build fails, try:

1. Clear Docker cache (see Issue 6)
2. Use the alternative production build
3. Check if there are any network issues

## Issue 8: Memory Issues

If you get memory-related errors during build:

```bash
# Increase Docker memory limit in Docker Desktop
# Go to Docker Desktop → Settings → Resources → Memory
# Increase to at least 4GB
```

## Issue 9: File Permission Issues

### On Windows:
- Run Command Prompt as Administrator
- Make sure Docker Desktop has access to your project folder

### On Mac:
- Make sure Docker Desktop has access to your project folder
- Check System Preferences → Security & Privacy → Privacy → Full Disk Access

## Issue 10: Network Issues

If you can't access the app in browser:

1. **Check if container is running:**
   ```bash
   docker ps
   ```

2. **Check container logs:**
   ```bash
   docker-compose logs
   ```

3. **Try different browser or incognito mode**

4. **Check firewall settings**

## Quick Fix Commands

### Most Common Solutions:

1. **Clear everything and rebuild:**
   ```bash
   docker-compose down
   docker system prune -a
   docker-compose --profile prod up --build
   ```

2. **Try alternative production build:**
   ```bash
   docker-compose --profile prod-alt up --build
   ```

3. **Use development build:**
   ```bash
   docker-compose --profile dev up --build
   ```

## Still Having Issues?

1. **Check Docker Desktop is running**
2. **Restart Docker Desktop**
3. **Restart your computer**
4. **Check the logs:**
   ```bash
   docker-compose logs -f
   ```

## Getting Help

- Check the main `DOCKER_README.md` for more detailed instructions
- Look at the platform-specific guides:
  - `DOCKER_101_MAC_GUIDE.md` for Mac users
  - `DOCKER_101_WINDOWS_GUIDE.md` for Windows users 