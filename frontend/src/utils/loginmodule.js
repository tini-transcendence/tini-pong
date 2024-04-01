import FetchModule from "./fetchmodule.js"

export default class {
	constructor() {
		this.loginStatus = false;
	}

	async isLogin() {
		const notLogined = () => {
			if (this.loginStatus === true) {
				clearTimeout(this.timerId);
				this.loginStatus = false;
			}
			alert("로그인이 필요합니다.");
			location.href = "/login";
		}

		const getLoginStatus = async (fetchModule) => {
			try {
				const response = await fetchModule.request(new Request("http://localhost:8000/user/status-update/", {
					method: 'POST',
					credentials: "include",
				}));
				this.timerId = setTimeout(getLoginStatus, 30000, fetchModule);
			} catch (error) {
				notLogined();
			}
		}

		const refreshToken = localStorage.getItem("refresh_token");
		if (refreshToken)
		{
			try {
				const fetchModule = new FetchModule();
				await fetchModule.request(new Request("http://localhost:8000/user/status-update/", {
					method: 'POST',
					credentials: "include",
				}));

				if (this.loginStatus === false) {
					this.loginStatus = true;
					this.timerId = setTimeout(getLoginStatus, 30000, fetchModule);
				}
			} catch (error) {
				notLogined();
			}
		}
		else {
			notLogined();
		}
	}
}