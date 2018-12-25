# Live Boids Wallpaper

![](media/boids.gif)

## Usage and confiuration

This project requires that you have the *Node package manager* installed.

### Running on your browser
Run ``npm start`` through your terminal to start the wallpaper on a local server. You can view it through ``localhost:3000`` on your web browser.

### Importing into WallpaperEngine
Use ``npm run build`` to compile the project. These compiled files can be imported into WallpaperEngine by selecting ``index.html`` in the ``out`` folder in WallpaperEngine wallpaper creator.

### Tweaking the Boid dynamics
Currently, there are a few presets in ``src/BoidSimulator.js`` on different behaviors. While this might not be the best way to configure the dynamics, you may tweak these values as much as you want to change the behavior of the Boid simulation.

### Tweaking draw style
There are two functions in ``src/main.js``, ``drawBoid`` and ``clear``, that you can tweak to change how the Boid simulation is displayed.