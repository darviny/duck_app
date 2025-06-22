# Docker 101 Guide for Windows - Running Duck App

Welcome to Docker! This guide will walk you through everything you need to know to run the Duck App project on your Windows computer, even if you've never used Docker before.

## 🚀 Quick Start (TL;DR)

1. **Install Docker Desktop** (see Step 1 below)
2. **Clone the project:**
   ```cmd
   git clone <repository-url>
   cd duck_app
   ```
3. **Run the app:**
   ```cmd
   docker-compose --profile prod up --build
   ```
4. **Open browser:** Go to `http://localhost`

That's it! The app will be running in your browser.

---

## What is Docker?

Think of Docker as a way to package an application with everything it needs to run (like a mini-computer inside your computer). This means:
- The app will work the same way on any computer
- You don't need to install Node.js, npm, or other dependencies on your Windows PC
- Everything is contained and won't mess up your system

## Step 1: Install Docker on Your Windows PC

### Prerequisites Check

**First, check your Windows version:**
1. Press `Windows key + R`
2. Type `winver` and press Enter
3. You need Windows 10 Pro, Enterprise, or Education (version 1903 or later) OR Windows 11

**If you have Windows 10 Home:**
- You'll need to install WSL 2 (Windows Subsystem for Linux) first
- Follow the WSL 2 installation guide from Microsoft

### Option A: Docker Desktop (Recommended for beginners)

1. **Download Docker Desktop:**
   - Go to [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
   - Click "Download for Windows"
   - The installer will automatically detect your Windows version

2. **Install Docker Desktop:**
   - Double-click the downloaded `Docker Desktop Installer.exe`
   - Follow the installation wizard
   - **Important:** When asked, make sure to check "Use WSL 2 instead of Hyper-V"
   - You may need to restart your computer

3. **First Launch:**
   - After restart, Docker Desktop will start automatically
   - You'll see a welcome screen with tutorials
   - Click "Skip tutorial" if you want to go straight to using it

4. **Verify Installation:**
   - Look for the Docker whale icon in your system tray (bottom right)
   - When it stops animating, Docker is ready
   - You can also open Docker Desktop from the Start menu

### Option B: Using Chocolatey (For advanced users)
```cmd
choco install docker-desktop
```

## Step 2: Understanding Docker Basics

### Key Terms:
- **Image**: Like a blueprint or template for your app
- **Container**: A running instance of an image (like a running app)
- **docker-compose**: A tool to run multiple containers together

### Think of it like this:
- **Image** = Recipe
- **Container** = Cooked meal
- **docker-compose** = Instructions to serve the meal

## Step 3: Getting Your Project Ready

### Option A: Clone from Git (Recommended)
1. **Open Command Prompt or PowerShell**
2. **Clone the project:**
   ```cmd
   git clone <repository-url>
   cd duck_app
   ```
   Replace `<repository-url>` with the actual Git repository URL.

### Option B: Download Project Files
1. **Download the project files** (ZIP file or folder)
2. **Extract to a folder** on your computer
3. **Open Command Prompt or PowerShell**
4. **Navigate to the project folder:**
   ```cmd
   cd C:\path\to\your\duck-app-folder
   ```
   Replace `C:\path\to\your\duck-app-folder` with the actual path to your project.

   **Tip:** You can also:
   - Open File Explorer
   - Navigate to your project folder
   - Click in the address bar
   - Type `cmd` and press Enter (this opens Command Prompt in that folder)

## Step 4: Running the Duck App

### First Time Setup (Production Version)

1. **Open Command Prompt/PowerShell and navigate to your project folder**

2. **Run the app:**
   ```cmd
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
   Step 1/15 : FROM node:20-alpine AS base
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

```cmd
docker-compose --profile dev up --build
```

Then visit: `http://localhost:5173`

## Step 5: Understanding What You're Seeing

### In Command Prompt/PowerShell:
- You'll see logs from the application
- The app is running in the background
- You can see what's happening in real-time

### In Browser:
- Your Duck App should be running
- It's the same app, just running inside Docker

### In Docker Desktop:
- Open Docker Desktop to see containers running
- Go to "Containers" tab to see your running app

## Step 6: Stopping the App

### Method 1: In Command Prompt/PowerShell
1. Go back to the Command Prompt/PowerShell window where the app is running
2. Press `Ctrl + C` (hold Control and press C)
3. Type `y` and press Enter if asked

### Method 2: Using Docker Desktop
1. Open Docker Desktop
2. Go to "Containers" tab
3. Click the stop button (⏹️) next to your running container

### Method 3: Using Command Line
```cmd
docker-compose down
```

## Step 7: Running the App Again (After First Time)

Once you've built the app once, you can run it again without rebuilding:

### Production Version:
```cmd
docker-compose --profile prod up
```

### Development Version:
```cmd
docker-compose --profile dev up
```

### Alternative Production Port (if port 80 is busy):
```cmd
docker-compose --profile prod-custom up
```
Then visit: `http://localhost:3000`

## Step 8: Common Commands You'll Use

### Check if containers are running:
```cmd
docker ps
```

### View logs:
```cmd
docker-compose logs
```

### Stop all containers:
```cmd
docker-compose down
```

### Start fresh (if something goes wrong):
```cmd
docker-compose down
docker system prune -a
docker-compose --profile prod up --build
```

## Step 9: Troubleshooting

### "Port already in use" error:
This means something else is using port 80. Try:
```cmd
docker-compose --profile prod-custom up
```
Then visit: `http://localhost:3000`

### "Permission denied" error:
- Make sure Docker Desktop is running
- Try running Command Prompt as Administrator
- Check that WSL 2 is properly installed

### "Docker is not running" error:
- Open Docker Desktop from Start menu
- Wait for it to fully start (whale icon stops animating)
- Try the command again

### App not loading in browser:
- Check that Docker Desktop is running
- Make sure the container is running: `docker ps`
- Try a different browser
- Check the logs: `docker-compose logs`

### WSL 2 issues:
- Open PowerShell as Administrator
- Run: `wsl --update`
- Restart your computer

## Step 10: Windows-Specific Tips

### File Paths:
- Use backslashes (`\`) in Windows paths
- Or use forward slashes (`/`) - Docker handles both
- Example: `C:\Users\YourName\Projects\duck-app`

### Antivirus Software:
- Some antivirus software may slow down Docker
- Add your project folder to antivirus exclusions if needed
- Docker Desktop has its own security features

### Windows Terminal (Recommended):
- Install Windows Terminal from Microsoft Store for better experience
- Supports tabs, better colors, and more features
- Right-click Start button → "Windows Terminal"

### WSL 2 Integration:
- Docker Desktop uses WSL 2 on Windows
- Your project files are accessible from both Windows and WSL
- Better performance than Hyper-V

## Step 11: Next Steps

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
- **Extensions**: Add useful tools

## Quick Reference

### First time running:
```cmd
docker-compose --profile prod up --build
```

### Run again (after first time):
```cmd
docker-compose --profile prod up
```

### Stop the app:
```cmd
docker-compose down
```

### View logs:
```cmd
docker-compose logs -f
```

### Access the app:
- Production: `http://localhost`
- Development: `http://localhost:5173`
- Alternative: `http://localhost:3000`

### Windows shortcuts:
- `Windows + R`: Run dialog
- `Windows + X`: Quick access menu
- `Ctrl + C`: Stop running process
- `Ctrl + Shift + Esc`: Task Manager

## Need Help?

- **Docker Desktop**: Check the whale icon in system tray
- **Command Prompt**: Use `docker --help` for command help
- **Documentation**: Check `DOCKER_README.md` for more advanced usage
- **Windows Terminal**: Better command line experience
- **Microsoft WSL**: [WSL Installation Guide](https://docs.microsoft.com/en-us/windows/wsl/install)

## Common Windows Issues

### "Docker Desktop is starting":
- Wait for the whale icon to stop animating
- Check Windows notifications for any errors
- Restart Docker Desktop if needed

### "WSL 2 not found":
- Install WSL 2: `wsl --install` in PowerShell as Administrator
- Restart computer after installation

### "Hyper-V not available":
- Enable Hyper-V in Windows Features
- Or use WSL 2 (recommended)

Congratulations! You've successfully containerized your first application on Windows! 🐳 