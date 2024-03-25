import FetchModule from "./fetchmodule.js"

export default class {
	constructor() {}

	async isLogin() {
		const refreshToken = localStorage.getItem("refresh_token");
		if (refreshToken)
		{
			try {
				const fetchModule = new FetchModule();
				await fetchModule.getReIssuedAccessToken(refreshToken);
			} catch (error) {
				this.notLogined();
			}
		}
		else
			this.notLogined();
	}

	notLogined() {
		alert("please login first!");
		location.href = "/login";
	}
}