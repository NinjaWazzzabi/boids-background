import Vec from "./Vec.js";
import BoidSimulator from "./BoidSimulator.js";
import Boid from "./Boid.js";

let canvas;
let ctx;

let width;
let height;

let boidSim;

const SIZE = 100;
const TIMESTEP = 0.1;

function addEvent(obj, evt, fn) {
	if (obj.addEventListener) {
		obj.addEventListener(evt, fn, false);
	} else if (obj.attachEvent) {
		obj.attachEvent("on" + evt, fn);
	}
}

function onLoad() {
	canvas = document.getElementById("canvas");

	width = window.innerWidth;
	height = window.innerHeight;

	ctx = canvas.getContext("2d");

	ctx.canvas.width = width;
	ctx.canvas.height = height;

	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, width, height);

	const tmpBoids = generateBoids(SIZE, width / 4, 10, width / 3, height / 3);
	boidSim = new BoidSimulator(tmpBoids, width, height);

	addEvent(document, "mouseout", function(e) {
		boidSim.mouseIn = false;
	});

	addEvent(document, "mousemove", function(e) {
		boidSim.mouseIn = true;
		boidSim.mousePos = new Vec(e.clientX, e.clientY);
	});

	const id = requestAnimationFrame(draw);
}

function generateBoids(
	size = 10,
	maxDim = 700,
	maxVel = 20,
	xOff = 200,
	yOff = 200
) {
	const boids = new Array(size);
	for (let i = 0; i < size; i++) {
		const x = Math.random() * maxDim + xOff;
		const y = Math.random() * maxDim + yOff;
		const vx = Math.random() * maxVel - maxVel / 2;
		const vy = Math.random() * maxVel - maxVel / 2;
		const boid = new Boid(new Vec(x, y), new Vec(vx, vy));
		boids[i] = boid;
	}

	return boids;
}

function clear() {
	ctx.save();
	ctx.globalCompositeOperation = "hard-light";
	ctx.fillStyle = "rgba(0,0,0,0.05)";
	ctx.fillRect(0, 0, width, height);
	ctx.globalCompositeOperation = "source-over";
	ctx.restore();
}

function draw() {
	ctx.save();

	clear();

	boidSim.update(TIMESTEP);

	for (let i = 0; i < boidSim.boids.length; i++) {
		const boid = boidSim.boids[i];
		drawBoid(boid);
	}

	ctx.restore();
	requestAnimationFrame(draw);
}

function drawBoid(boid) {
	ctx.save();
	ctx.strokeStyle = "#008000";
	if (boid.vel.magSq() == 0) {
		ctx.beginPath();
		ctx.arc(boid.pos.x, boid.pos.y, 5, 0, Math.PI * 2);
		ctx.fill();
	} else {
		ctx.lineWidth = 2;
		const size = 5;
		const halfSize = size / 2;

		const rotation = boid.vel.rotation();

		let l = new Vec(-halfSize, -size);
		let c = new Vec(halfSize, 0);
		let r = new Vec(-halfSize, size);

		l = l.rotate(rotation);
		c = c.rotate(rotation);
		r = r.rotate(rotation);

		const xOff = boid.pos.x;
		const yOff = boid.pos.y;

		ctx.beginPath();
		ctx.moveTo(l.x + xOff, l.y + yOff);
		ctx.lineTo(c.x + xOff, c.y + yOff);
		ctx.lineTo(r.x + xOff, r.y + yOff);

		ctx.stroke();
	}
	ctx.restore();
}

window.onload = onLoad;
