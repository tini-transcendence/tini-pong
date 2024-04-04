import AbstractComponent from "./AbstractComponent.js";
import {containerEventKeyUp, containerEventKeyDown} from "../games/localPongBasic.js"
import {containerEventKeyUp as containerEventKeyUpM, containerEventKeyDown as containerEventKeyDownM} from "../games/localPongMultiple.js"
import {containerEventKeyUp as containerEventKeyUpT, containerEventKeyDown as containerEventKeyDownT} from "../games/localPongTournament.js"

export default class extends AbstractComponent {
	constructor() {
		super();
		this.setTitle("Main");
	}

	async getHtml(loginModule) {
		loginModule.isLogin();
		return `
		<h1>Welcome!</h1>
		<p>This is Main page.</p>
		<button class="btn btn-outline-primary" data-href="/local">LOCAL</button>
		<button class="btn btn-outline-primary" data-href="/lobby">ONLINE</button>
		`;
	}

	handleRoute() {
		window.document.removeEventListener('keydown', containerEventKeyDown);
		window.document.removeEventListener('keyup', containerEventKeyUp);
		window.document.removeEventListener('keydown', containerEventKeyDownM);
		window.document.removeEventListener('keyup', containerEventKeyUpM);
		window.document.removeEventListener('keydown', containerEventKeyDownT);
		window.document.removeEventListener('keyup', containerEventKeyUpT);
	}
}