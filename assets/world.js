
// The root object of the game scene.
class World {
  constructor() {
    this.objects = {
      drone: [],
      bullet: []
    };
    this.running = false;
  }

  add(obj) {
    this.objects[obj.type].push(obj);
    obj.added(this);
  };

  remove(obj) {
    obj.ui.remove();
    const index = this.objects[obj.type].indexOf(obj);
    this.objects[obj.type].splice(index, 1);
  }

  size(width, height) {
    this.width = width;
    this.height = height;
    this.xMin = -(this.xMax = this.width / 2);
    this.yMin = -(this.yMax = this.height / 2);
    return this;
  };

  run(run) {
    this.running = run !== false;
  };

  hitTest(drone) {
    const boundBox = drone.boundBox();
    for (let i = 0; i < this.objects['bullet'].length; i++) {
      const bullet = this.objects['bullet'][i];
      if (bullet.owner != drone &&
          bullet.x >= boundBox[0].x &&
          bullet.x <= boundBox[1].x &&
          bullet.y >= boundBox[0].y &&
          bullet.y <= boundBox[1].y) {
        return bullet;
      }
    }
  }

  detectCollision(drone) {
    const bullet = this.hitTest(drone);
    if (bullet) {
      this.remove(bullet);
      drone.ui.tween(300, true).ease('bounce').offset(10, 10).done(() => {
        drone.ui.hide();
        window.setTimeout(() => {
          drone.ui.show();
        }, 4000);
      });
    }
  }

  tick(t) {
    if (this.running) {
      t = Math.min(100, t);

      // Collision detection
      this.objects['drone'].forEach(drone => {
        this.detectCollision(drone);
      });

      Object.values(this.objects).forEach(objects => {
        objects.forEach(x => x.tick(t));
      });
    }
  };
}

export default World;