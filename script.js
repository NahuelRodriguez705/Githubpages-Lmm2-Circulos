const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const resetButton = document.getElementById('resetButton');
const numCircles = 300;  // Aumentar el número de círculos
const circles = [];
let outlinedCircle;
let growing = false;
let showResetButton = false;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Circle {
    constructor(x, y, radius, filled) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.filled = filled;
    }

    display() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        if (this.filled) {
            ctx.fillStyle = 'black';
            ctx.fill();
        } else {
            ctx.strokeStyle = 'black';
            ctx.stroke();
        }
    }

    grow() {
        if (this.x - this.radius > 0 && this.x + this.radius < canvas.width && this.y - this.radius > 0 && this.y + this.radius < canvas.height) {
            this.radius += 1;
            return true;
        }
        return false;
    }

    intersects(other) {
        const distance = Math.hypot(this.x - other.x, this.y - other.y);
        return distance < this.radius + other.radius;
    }

    push(other) {
        const angle = Math.atan2(this.y - other.y, this.x - other.x);
        this.x = other.x + Math.cos(angle) * (this.radius + other.radius);
        this.y = other.y + Math.sin(angle) * (this.radius + other.radius);
        this.x = Math.max(this.radius, Math.min(this.x, canvas.width - this.radius));
        this.y = Math.max(this.radius, Math.min(this.y, canvas.height - this.radius));
    }
}

function createCircles() {
    const radius = 15;
    for (let i = 0; i < numCircles; i++) {
        const x = Math.random() * (canvas.width - 2 * radius) + radius;
        const y = Math.random() * (canvas.height - 2 * radius) + radius;
        circles[i] = new Circle(x, y, radius, true);
    }
    outlinedCircle = new Circle(canvas.width / 2, canvas.height / 2, radius, false);
}

function resetSketch() {
    createCircles();
    growing = false;
    showResetButton = false;
    resetButton.classList.add('hidden');
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const c of circles) {
        c.display();
    }

    outlinedCircle.display();

    if (growing) {
        if (!outlinedCircle.grow()) {
            growing = false;
            showResetButton = true;
            resetButton.classList.remove('hidden');
        } else {
            for (const c of circles) {
                if (c !== outlinedCircle && outlinedCircle.intersects(c)) {
                    c.push(outlinedCircle);
                }
            }
        }
    }
}

function update() {
    draw();
    requestAnimationFrame(update);
}

canvas.addEventListener('click', (event) => {
    if (showResetButton && resetButton.matches(':hover')) {
        resetSketch();
    } else {
        growing = !growing;
    }
});

resetButton.addEventListener('click', resetSketch);

resetSketch();
update();
