/* refetch module use
const reqGet = new Request("link", {
	method: 'GET',
})
const reqPost = new Request("link", {
	method: 'POST',
	headers: {
		"Content-Type": "application/json"
	},
	body: JSON.stringify({

	}),
})
const req = new request(reqGet);
*/

export default class {
	constructor(reqInit) {
		this.isRefreshing = false;
		this.refreshTokenPromise = null;
		this.reqInit = reqInit;
	}

	async request() {
		const response = await fetch(this.reqInit);
	}
}