class AnimateGame {
	constructor() {
		this.animate = false;
	}

	setAnimateOn() {
		this.animate = true;
	}

	setAnimateOff() {
		this.animate = false;
	}

	getAnimate() {
		return (this.animate);
	}
}

var animateGame = new AnimateGame();

export default animateGame;