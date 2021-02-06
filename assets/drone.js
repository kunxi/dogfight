const Math = Stage.Math;
import Bullet from './bullet.js';

const FIRE_RELOAD_TIME = 2000;
const BULLET_SPEED = 100 / 2000 * 2.2;
let wallClock = 0;
let canFireTime = 0;

class Drone {
  constructor({vMin, vMax, aMax, x, y, texture}) {
    this.x = x;
    this.y = y;
    this.vMin = vMin;
    this.vMax = vMax;
    this.aMax = aMax;
    this.vx = 0;
    this.vy = vMin;
    this.v = vMin;
    this.dir = Math.PI / 2;
    this.rotation = 0;
    this.accMain = 0;
    this.accSide = 0;

    this.keyCodes = {}; // Controls
    this.firing = false;
    this.type = 'drone';
    this.uiCreate(texture);
  }

  uiCreate(texture) {
    this.ui = Stage.create().pin('handle', 0.5);
    this.ui.drone = Stage.image(texture).pin('handle', 0.5).appendTo(this.ui);
    this.ui.shadow = Stage.image(texture).pin('handle', 0.5).pin({
      alpha : 0.2,
      offsetX : 30,
      offsetY : 30
    }).appendTo(this.ui);
    this.uiUpdate();
  };

  uiUpdate() {
    this.ui.offset(this);
    const scaley = 1 - Math.abs(this.rotation) / Math.PI * 400;
    this.ui.drone.rotate(this.dir).scale(1, scaley);
    this.ui.shadow.rotate(this.dir).scale(1, scaley);
  };

  // Control
  added(world) {
    // circular dependency detected.
    this.world = world;
    this.ui.appendTo(world.ui);
  }

  // Keyboard Control: keyCodes.
  registerControl(opts) {
    let keyCodes = {};
    keyCodes[opts.mainAcc] = false;
    keyCodes[opts.mainDec] = false;
    keyCodes[opts.sideAcc] = false;
    keyCodes[opts.sideDec] = false;
    keyCodes[opts.fire] = false;

    const update = () => {
      this.accMain = keyCodes[opts.mainAcc] ? +1 : keyCodes[opts.mainDec] ? -1 : 0;
      this.accSide = keyCodes[opts.sideAcc] ? +1 : keyCodes[opts.sideDec] ? -1 : 0;
      this.firing = keyCodes[opts.fire];
    };

    document.addEventListener('keydown', e => {
      e = e || window.event;
      if (e.keyCode in keyCodes) {
        keyCodes[e.keyCode] = true;
      }
      update();
    });

    document.addEventListener('keyup', e => {
      e = e || window.event;
      if (e.keyCode in keyCodes) {
        keyCodes[e.keyCode] = false;
      }
      update();
    });
  }

  boundBox() {
    return [
      {x: this.x - 8, y: this.y - 8},
      {x: this.x + 8, y: this.y + 9}
    ];
  }

  tick(t) {
    if (!t) { return; }
    wallClock += t;
    
    var m = 0, n = 0;

    if (this.accMain !== 0 || this.accSide !== 0) {
      n = this.accMain * 0.001;
      m = this.accSide * this.aMax;
    }

    if (m || n) {
      m = Math.limit(m, -this.aMax, this.aMax);
      m = m / this.v;

      this.vx += +this.vx * n * t;
      this.vy += +this.vy * n * t;

      this.vx += +this.vy * m * t;
      this.vy += -this.vx * m * t;

      var v = Math.length(this.vx, this.vy);
      this.v = Math.limit(v, this.vMin, this.vMax);
      v = this.v / v;
      this.vx *= v;
      this.vy *= v;

      var dir = Math.atan2(this.vy, this.vx);
      this.rotation = (this.rotation * (200 - t) + Math.rotate(this.dir - dir,
          -Math.PI, Math.PI)) / 200;
      this.dir = dir;

    } else {
      this.rotation = (this.rotation * (200 - t)) / 200;
    }

    this.x = Math.rotate(this.x + this.vx * t, this.world.xMin, this.world.xMax);
    this.y = Math.rotate(this.y + this.vy * t, this.world.yMin, this.world.yMax);

    this.uiUpdate();

    // Fire!
    if (this.firing && wallClock > canFireTime ) {
      canFireTime = wallClock + FIRE_RELOAD_TIME;
      const bullet = new Bullet({
        x: this.x + 8 * Math.cos(this.dir),
        y: this.y + 8 * Math.sin(this.dir),
        vx: 1.5 * this.vMax * Math.cos(this.dir),
        vy: 1.5 * this.vMax * Math.sin(this.dir),
        owner: this,
      });
      this.world.add(bullet);
    }
  };
}

export default Drone;