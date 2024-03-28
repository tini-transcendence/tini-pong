export default class {
	constructor() {
		this.isRefreshing = false;
		this.refreshTokenPromise = null;
	}

	// 기본 요청에 대한 fetch
	async request(requestInit) {
		try {
			const response = await fetch(requestInit);

			if (response.status === 401) {
				return this.handleExpiredAccesstoken(requestInit);
			}
			return response;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	// 토큰이 만료되었을 때 토큰 재발급 후 re-fetch
	async handleExpiredAccesstoken(requestInit) {
		try {
			let reIssuedAccessToken;
			if (!this.isRefreshing) {
				this.isRefreshing = true;
				this.refreshTokenPromise = this.getReIssuedAccessToken(localStorage.getItem("refresh_token"));

				reIssuedAccessToken = await this.refreshTokenPromise;

				this.isRefreshing = false;
			}
			else if (this.refreshTokenPromise) {
				reIssuedAccessToken = await this.refreshTokenPromise;
			}

			requestInit.headers.Authorization = reIssuedAccessToken;

			const retryResponse = await fetch(requestInit);

			if (retryResponse.status === 401)
				throw new Error(retryResponse.statusText)
			return retryResponse;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	// 토큰 재발급
	async getReIssuedAccessToken(refreshToken) {
		try {
			const response = await fetch('http://localhost:8000/auth/refresh/', {
				method: 'POST',
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					refresh_token: refreshToken
				})
			})
			if (!response.ok)
				throw new Error(response.statusText);
			return response;
		} catch (error) {
			throw new Error(error.message);
		}
	}
}