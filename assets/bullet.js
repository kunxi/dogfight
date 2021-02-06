const Math = Stage.Math;
const BULLET_LIFE_TIME = 1500;

class Bullet {
  constructor({x, y, vx, vy, owner}) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.owner = owner;
    this.life_cycle = 0;

    this.type = 'bullet';
    this.uiCreate();
  }

  uiCreate() {
    this.ui = Stage.image('bullet').pin('handle', 0);
    this.uiUpdate();
  }

  uiUpdate() {
    this.ui.offset(this);
  }

  added(world) {
    // circular dependency detected.
    this.world = world;
    this.ui.appendTo(world.ui);
  }
  tick(t) {
    this.life_cycle += t;
    this.x += this.vx * t;
    this.y += this.vy * t;

    if (this.life_cycle > BULLET_LIFE_TIME ||
        this.x < this.world.xMin ||
        this.x > this.world.xMax ||
        this.y < this.world.yMin ||
        this.y > this.world.yMax) {
      // Destroy the bullet
      this.world.remove(this);
      return;
    }
    this.uiUpdate();
  }
}

export default Bullet;