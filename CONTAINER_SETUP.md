# Duck App - Container Setup

## Prerequisites
- Docker installed
- Docker Compose installed

## Quick Start

### 1. Build and Run
```bash
# Build the container
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

### 2. Access the Application
- Frontend: http://localhost:3000
- Backend API: Available through the container

### 3. Development Mode
```bash
# Run with live reload
docker-compose up

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

## Container Features

### ✅ Pre-configured Environment
- Node.js 18
- All dependencies installed
- Amplify backend configured
- Development server ready

### ✅ Hot Reload
- Source code changes reflect immediately
- Backend changes auto-reload
- No manual restart needed

### ✅ Isolated Environment
- No system dependencies required
- Consistent across different machines
- No AWS configuration needed

## Troubleshooting

### Port Already in Use
```bash
# Change port in docker-compose.yml
ports:
  - "3001:3000"  # Use port 3001 instead
```

### Container Won't Start
```bash
# Check logs
docker-compose logs

# Rebuild from scratch
docker-compose down
docker-compose up --build --force-recreate
```

### Permission Issues
```bash
# On Linux/Mac, you might need:
sudo docker-compose up --build
```

## File Structure in Container
```
/app/
├── src/           # Frontend source code
├── amplify/       # Backend configuration
├── package.json   # Dependencies
└── dist/         # Built application
```

## Benefits of Container Approach

1. **Zero Configuration**: No AWS setup required
2. **Consistent Environment**: Works the same everywhere
3. **Easy Sharing**: Just share the container files
4. **Isolated**: Doesn't affect host system
5. **Portable**: Runs on any machine with Docker

## Next Steps

1. Run `docker-compose up --build`
2. Open http://localhost:3000
3. Start developing!

The container includes everything needed to run the Duck App without any additional configuration. 