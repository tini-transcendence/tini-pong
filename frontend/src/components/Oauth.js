import AbstractComponent from "./AbstractComponent.js";

export default class extends AbstractComponent {
	constructor() {
		super();
		this.setTitle("Login oauth");
	}

	async getHtml() {
		return `
		<div class="spinner-border" role="status">
			<span class="visually-hidden">Loading...</span>
		</div>
		`;
	}

	handleRoute() {
		const queryString = location.search;
		fetch(`http://localhost:8000/user/login/oauth${queryString}`, {
				method: 'GET',
		})
		.then(response => {
			return response.json();
		})
		.then(data => {
			console.log(data.refresh_token);
			localStorage.setItem("refresh_token", data.refresh_token);
		});
	}
}