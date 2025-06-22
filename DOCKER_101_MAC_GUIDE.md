# Docker 101 Guide for Mac - Running Duck App

Welcome to Docker! This guide will walk you through everything you need to know to run the Duck App project on your Mac, even if you've never used Docker before.

## What is Docker?

Think of Docker as a way to package an application with everything it needs to run (like a mini-computer inside your computer). This means:
- The app will work the same way on any computer
- You don't need to install Node.js, npm, or other dependencies on your Mac
- Everything is contained and won't mess up your system

## Step 1: Install Docker on Your Mac

### Option A: Docker Desktop (Recommended for beginners)

1. **Download Docker Desktop:**
   - Go to [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
   - Click "Download for Mac"
   - Choose the right version for your Mac (Apple Silicon or Intel chip)

2. **Install Docker Desktop:**
   - Double-click the downloaded `.dmg` file
   - Drag Docker to your Applications folder
   - Open Docker from Applications
   - Follow the setup wizard (you may need to enter your password)

3. **Verify Installation:**
   - Look for the Docker whale icon in your menu bar (top of screen)
   - When it stops animating, Docker is ready

### Option B: Using Homebrew (For advanced users)
```bash
brew install --cask docker
```

## Step 2: Understanding Docker Basics

### Key Terms:
- **Image**: Like a blueprint or template for your app
- **Container**: A running instance of an image (like a running app)
- **Dockerfile**: Instructions for building an image
- **docker-compose**: A tool to run multiple containers together

### Think of it like this:
- **Image** = Recipe
- **Container** = Cooked meal
- **Dockerfile** = Cooking instructions

## Step 3: Getting Your Project Ready

1. **Download the project files:**
   - Make sure you have all the project files in a folder
   - The folder should contain `Dockerfile`, `docker-compose.yml`, etc.

2. **Open Terminal:**
   - Press `Cmd + Space` to open Spotlight
   - Type "Terminal" and press Enter

3. **Navigate to your project:**
   ```bash
   cd /path/to/your/duck-app-folder
   ```
   Replace `/path/to/your/duck-app-folder` with the actual path to your project.

## Step 4: Running the Duck App

### First Time Setup (Production Version)

1. **Open Terminal and navigate to your project folder**

2. **Build and run the app:**
   ```bash
   docker-compose --profile prod up --build
   ```

3. **What this command does:**
   - `docker-compose`: The tool we're using
   - `--profile prod`: Use the production configuration
   - `up`: Start the containers
   - `--build`: Build the images first (needed the first time)

4. **You'll see output like this:**
   ```
   Building duck-app
   Step 1/15 : FROM node:18-alpine AS base
   ...
   Successfully built abc123def456
   Creating duck_app_duck-app_1 ... done
   Attaching to duck_app_duck-app_1
   ```

5. **When it's done, open your web browser and go to:**
   ```
   http://localhost:80
   ```
   or just:
   ```
   http://localhost
   ```

### Development Version (With Hot Reloading)

If you want to make changes to the code and see them immediately:

```bash
docker-compose --profile dev up --build
```

Then visit: `http://localhost:5173`

## Step 5: Understanding What You're Seeing

### In Terminal:
- You'll see logs from the application
- The app is running in the background
- You can see what's happening in real-time

### In Browser:
- Your Duck App should be running
- It's the same app, just running inside Docker

## Step 6: Stopping the App

### Method 1: In Terminal
1. Go back to the Terminal window where the app is running
2. Press `Ctrl + C` (hold Control and press C)
3. Type `y` and press Enter if asked

### Method 2: Using Docker Desktop
1. Open Docker Desktop
2. Go to "Containers" tab
3. Click the stop button (⏹️) next to your running container

## Step 7: Common Commands You'll Use

### Check if containers are running:
```bash
docker ps
```

### View logs:
```bash
docker-compose logs
```

### Stop all containers:
```bash
docker-compose down
```

### Remove everything and start fresh:
```bash
docker-compose down
docker system prune -a
docker-compose --profile prod up --build
```

## Step 8: Troubleshooting

### "Port already in use" error:
This means something else is using port 80. Try:
```bash
docker-compose --profile prod-custom up --build
```
Then visit: `http://localhost:3000`

### "Permission denied" error:
- Make sure Docker Desktop is running
- Try running the command again

### "Build failed" error:
- Make sure you're in the right folder
- Check that all files are present
- Try: `docker system prune -a` then build again

### App not loading in browser:
- Check that Docker Desktop is running
- Make sure the container is running: `docker ps`
- Try a different browser
- Check the logs: `docker-compose logs`

## Step 9: Understanding the Files

### What each file does:
- **`Dockerfile`**: Instructions for building the production app
- **`Dockerfile.dev`**: Instructions for building the development app
- **`docker-compose.yml`**: Configuration for running the app
- **`nginx.conf`**: Web server configuration
- **`.dockerignore`**: Files to exclude from the build

## Step 10: Next Steps

### Once you're comfortable:
1. **Try the development version** for making changes
2. **Learn more Docker commands** from the main README
3. **Explore Docker Desktop** to see what's happening
4. **Try modifying the app** and see changes in real-time

### Useful Docker Desktop features:
- **Containers tab**: See running containers
- **Images tab**: See built images
- **Volumes tab**: See data storage
- **Settings**: Configure Docker behavior

## Quick Reference

### Start the app:
```bash
docker-compose --profile prod up --build
```

### Stop the app:
```bash
docker-compose down
```

### View logs:
```bash
docker-compose logs -f
```

### Access the app:
- Production: `http://localhost`
- Development: `http://localhost:5173`

## Need Help?

- **Docker Desktop**: Check the whale icon in your menu bar
- **Terminal**: Use `docker --help` for command help
- **Documentation**: Check `DOCKER_README.md` for more advanced usage

Congratulations! You've successfully containerized your first application! 🐳 