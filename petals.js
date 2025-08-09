const canvas = document.getElementById('petal-canvas');
const ctx = canvas.getContext('2d');

let width, height;
function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Petal {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = 8 + Math.random() * 8;
    this.speedY = 0.5 + Math.random() * 1.5;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.angle = Math.random() * 360;
    this.spinSpeed = (Math.random() - 0.5) * 0.1;
    this.opacity = 0.6 + Math.random() * 0.4;
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    this.angle += this.spinSpeed;

    if (this.y > height + this.size) this.reset();
    if (this.x > width + this.size) this.x = -this.size;
    if (this.x < -this.size) this.x = width + this.size;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    
    // Draw a simple petal shape
    const petalGradient = ctx.createRadialGradient(0, 0, this.size * 0.1, 0, 0, this.size);
    petalGradient.addColorStop(0, `rgba(217, 162, 235, ${this.opacity})`);
    petalGradient.addColorStop(1, `rgba(185, 123, 209, 0)`);
    
    ctx.fillStyle = petalGradient;
    
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(this.size * 0.4, -this.size * 0.7, this.size * 1.2, -this.size * 0.3, 0, this.size);
    ctx.bezierCurveTo(-this.size * 1.2, -this.size * 0.3, -this.size * 0.4, -this.size * 0.7, 0, 0);
    ctx.fill();
    
    ctx.restore();
  }
}

const petals = [];
const petalCount = 60;

for(let i = 0; i < petalCount; i++) {
  petals.push(new Petal());
}

// Track mouse for extra petals on hover
let mouse = { x: -1000, y: -1000 };
window.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

// Bonus petals following the mouse
class MousePetal extends Petal {
  constructor() {
    super();
    this.x = mouse.x;
    this.y = mouse.y;
    this.size = 10 + Math.random() * 10;
    this.speedY = 0;
    this.speedX = 0;
    this.opacity = 0.9;
  }

  update() {
    this.x += (mouse.x - this.x) * 0.15;
    this.y += (mouse.y - this.y) * 0.15;
    this.angle += this.spinSpeed;
  }
}

const mousePetals = [];
for(let i = 0; i < 10; i++) {
  mousePetals.push(new MousePetal());
}

function animate() {
  ctx.clearRect(0, 0, width, height);
  petals.forEach(p => {
    p.update();
    p.draw();
  });
  mousePetals.forEach(mp => {
    mp.update();
    mp.draw();
  });
  requestAnimationFrame(animate);
}

animate();
