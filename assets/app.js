// Create and start an application

import World from './world.js';
import Drone from './drone.js';

Stage(function(stage, display) {

  stage.viewbox(300, 300).pin('handle', -0.5);

  const world = new World();
  world.ui = stage;

  const speed = 100 / 2000;
  const acc = speed * 2 / 1000;

  const drone = new Drone({
    vMin: speed, 
    vMax: speed * 1.5, 
    aMax: acc, 
    x: -75,
    y: 0,
    texture: 'drone',
  });
  world.add(drone);
  drone.registerControl({
    mainAcc: 87, // W
    mainDec: 83, // S
    sideAcc: 65, // A
    sideDec: 68, // D
    fire: 32, // Space
  });

  const fighter = new Drone({
    vMin: speed, 
    vMax: speed * 1.5, 
    aMax: acc, 
    x: 75,
    y: 0,
    texture: 'fighter',
  });
  world.add(fighter);
  fighter.registerControl({
    mainAcc: 38, // KeyUp
    mainDec: 40, // KeyDown
    sideAcc: 37, // LeftArrow
    sideDec: 39, // RightArrow
    fire: 13, // Enter
  });
  
  document.addEventListener('keydown', e => {
    world.run(true);
    stage.touch();
  });

  stage.on('viewport', function() {
    world.size(this.pin('width'), this.pin('height'));
  });

  // Game loop
  stage.tick((t) => {
    world.tick(t);
  });
});

// Textures
Stage({
  image : {
    src : './main.png',
    ratio : 4
  },
  textures : {
    fighter: {
      x : 0,
      y : 0,
      width : 16,
      height : 16
    },

    // FIXME
    bullet: {
      x : 7,
      y : 7,
      width : 1,
      height : 1
    },
    
    drone: {
      x : 48,
      y : 0,
      width : 16,
      height : 16
    },

  }
});