export default class Vec {
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	add(vec) {
		return new Vec(this.x + vec.x, this.y + vec.y);
	}

	sub(vec) {
		return new Vec(this.x - vec.x, this.y - vec.y);
	}

	magSq() {
		return this.x * this.x + this.y * this.y;
	}

	mag() {
		return Math.sqrt(this.magSq());
	}

	mul(scalar) {
		return new Vec(this.x * scalar, this.y * scalar);
	}

	norm() {
		const mag = this.mag();
		return this.mul(1 / mag);
	}

	distTo(vec) {
		return vec.sub(this).mag();
	}

	dot(vec) {
		return this.x * vec.x + this.y * vec.y;
	}

	// alpha = acos( (a * b) / (|a| * |b|))
	rotation() {
		const base = new Vec(1, 0);

		const ab = this.dot(base);
		const denom = this.mag() * base.mag();

		return Math.acos(ab / denom) * Math.sign(this.y);
	}

	rotate(rad) {
		return new Vec(
			Math.cos(rad) * this.x - Math.sin(rad) * this.y,
			Math.sin(rad) * this.x + Math.cos(rad) * this.y
		);
	}
}
