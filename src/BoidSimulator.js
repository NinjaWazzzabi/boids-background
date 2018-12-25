import Vec from "./Vec.js";

const MAX_SPEED = 60;
const VISSPHERE = 60;
const MOUSE = 0.00001;

const FOLLOW_MOUSE = false;

const COHESION = 0.04;
const ALIGNMENT = 0.04;
const SEPARATION = 0.3;

// const VISSPHERE = 30;
// const COHESION = 0.3;
// const ALIGNMENT = 0.2;
// const SEPARATION = 0.9;

export default class BoidSimulator {
	constructor(boids, width, height) {
		this.width = width;
		this.height = height;
		this.mouseIn = false;
		this.mousePos = new Vec();
		this.boids = boids;
	}

	update(timeStep) {
		const visSphere = new Array(this.boids.length);

		for (let i = 0; i < visSphere.length; i++) {
			visSphere[i] = new Array(0);
		}

		// Compute visibility spheres
		for (let i = 0; i < this.boids.length; i++) {
			const boid = this.boids[i];

			for (let j = i + 1; j < this.boids.length; j++) {
				const otherBoid = this.boids[j];
				const distance = boid.pos.sub(otherBoid.pos).mag();

				if (distance < VISSPHERE) {
					visSphere[i].push(this.boids[j]);
					visSphere[j].push(this.boids[i]);
				}
			}
		}

		const bAcc = new Array(this.boids.length);

		// Update acceleration for each boid
		for (let boidI = 0; boidI < this.boids.length; boidI++) {
			const boid = this.boids[boidI];

			const cohesion = compCohesion(boid, visSphere[boidI])
				.mul(COHESION)
				.mul(1 / (timeStep * timeStep));
			const alignment = compAlignment(boid, visSphere[boidI])
				.mul(ALIGNMENT)
				.mul(1 / timeStep);
			const separation = compSeparation(boid, visSphere[boidI])
				.mul(SEPARATION)
				.mul(1 / (timeStep * timeStep));

			const acc = cohesion
				.add(alignment)
				.add(separation)
				.mul(timeStep);

			const mouseMove = compMouse(
				boid,
				this.mouseIn,
				this.mousePos,
				this.width,
				this.height
			).mul(MOUSE);

			bAcc[boidI] = acc.add(mouseMove);
		}

		// Update velocity for each boid
		for (let boidI = 0; boidI < this.boids.length; boidI++) {
			const boid = this.boids[boidI];
			let velUpdate = boid.vel.add(bAcc[boidI].mul(timeStep));

			if (velUpdate.mag() > MAX_SPEED) {
				velUpdate = velUpdate.norm().mul(MAX_SPEED);
			}

			boid.vel = velUpdate;
		}

		// Update position for each boid
		for (let boidI = 0; boidI < this.boids.length; boidI++) {
			const boid = this.boids[boidI];
			boid.pos = boid.pos.add(boid.vel.mul(timeStep));
		}
	}
}

function compCohesion(boid, boids) {
	if (boids.length < 1) {
		return new Vec();
	} else {
		let sum = new Vec();
		for (let i = 0; i < boids.length; i++) {
			const boid = boids[i];
			sum = sum.add(boid.pos);
		}
		const centre = sum.mul(1 / boids.length);
		return centre.sub(boid.pos);
	}
}

function compMouse(boid, mouseIn, mousePos, width, height) {
	if (mouseIn && FOLLOW_MOUSE) {
		return mousePos.sub(boid.pos).mul(boid.pos.distTo(mousePos));
	} else {
		const middle = new Vec(width / 2, height / 2);
		return middle.sub(boid.pos).mul(boid.pos.distTo(middle));
	}
}

function compAlignment(boid, boids) {
	if (boids.length < 1) {
		return new Vec();
	}
	let sum = new Vec();
	for (let i = 0; i < boids.length; i++) {
		const otherBoid = boids[i];
		sum = sum.add(otherBoid.vel);
	}
	const avgAlignment = sum.mul(1 / boids.length);
	return avgAlignment.sub(boid.vel);
}

function compSeparation(boid, boids) {
	const value = 10;
	if (boids.length < 1) {
		return new Vec();
	}
	let sum = new Vec();
	for (let i = 0; i < boids.length; i++) {
		const otherBoid = boids[i];
		const offset = sum.add(boid.pos.sub(otherBoid.pos));
		sum = sum.add(offset.mul(1 / offset.mag()));
	}
	return sum;
}
