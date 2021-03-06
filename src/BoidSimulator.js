import Vec from "./Vec.js";

const MAX_SPEED = 60;
const MOUSE = 100;

const MOUSE_REPEL = true;

// Preset 1
// const VISSPHERE = 60;
// const COHESION = 0.04;
// const ALIGNMENT = 0.04;
// const SEPARATION = 0.3;
// const CONTAINER = 2;

// Preset 2
// const VISSPHERE = 30;
// const COHESION = 0.3;
// const ALIGNMENT = 0.2;
// const SEPARATION = 0.9;
// const CONTAINER = 2;

// Preset 3
const VISSPHERE = 60;
const COHESION = 0.07;
const ALIGNMENT = 0.09;
const SEPARATION = 0.2;
const CONTAINER = 0.25;

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

			const boidAcceleration = cohesion
				.add(alignment)
				.add(separation)
				.mul(timeStep);

			const mouseRepelAcc = MOUSE_REPEL
				? compMouseRepel(boid, this.mouseIn, this.mousePos)
						.mul(1 / timeStep)
						.mul(MOUSE)
				: new Vec();

			const windowContainerAttraction = compWindowContainerAttraction(
				boid,
				this.width,
				this.height
			)
				.mul(1 / timeStep)
				.mul(CONTAINER);

			bAcc[boidI] = boidAcceleration
				.add(mouseRepelAcc)
				.add(windowContainerAttraction);
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

function compMouseRepel(boid, mouseIn, mousePos) {
	if (mouseIn) {
		const distance = mousePos.distTo(boid.pos);
		return boid.pos.sub(mousePos).mul(1 / distance ** 2.4);
	} else {
		return new Vec();
	}
}

function compWindowContainerAttraction(boid, width, height) {
	const THRESHOLD = 100;

	const force = new Vec();
	if (boid.pos.x < THRESHOLD) {
		force.x = 1;
	} else if (boid.pos.x > width - THRESHOLD) {
		force.x = -1;
	}

	if (boid.pos.y < THRESHOLD) {
		force.y = 1;
	} else if (boid.pos.y > height - THRESHOLD) {
		force.y = -1;
	}

	return force;
}

function compCentreAttraction(boid, width, height) {
	const middle = new Vec(width / 2, height / 2);
	return middle.sub(boid.pos).mul(boid.pos.distTo(middle));
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
