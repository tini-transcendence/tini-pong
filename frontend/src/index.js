import "../node_modules/bootstrap/dist/js/bootstrap.js"

import Navbar from "./components/Navbar.js";
import Main from "./components/Main.js";
import Login from "./components/Login.js";
import Oauth from "./components/Oauth.js";
import OtpQR from "./components/OtpQR.js";
import Otp from "./components/Otp.js";
import UserPage from "./components/UserPage.js";
import UserEdit from "./components/UserEdit.js";
import Lobby from "./components/Lobby.js";
import Local from "./components/Local.js";
import Tdata from "./components/tournamentData.js";
import Room from "./components/Room.js";
import NotFound from "./components/NotFound.js";

import LoginModule from "./utils/loginmodule.js";
import animateGame from "./utils/animateGameModule.js";

export const DOMAIN_NAME = "localhost"
export const BACKEND_URL = `https://${DOMAIN_NAME}:8000`

const ROUTE_PARAMETER_REGEX = /:(\w+)/g;
const URL_FRAGMENT_REGEX = /\//g;

const routes = [
	{ path: "/", component: [Main, Navbar], login: true},
	{ path: "/login", component: [Login], login: false},
	{ path: "/login/oauth", component: [Oauth], login: false},
	{ path: "/login/otp/qr", component: [OtpQR], login: false},
	{ path: "/login/otp", component: [Otp], login: false},
	{ path: "/mypage", component: [UserPage, Navbar], login: true},
	{ path: "/users/:useruuid", component: [UserPage, Navbar], login: true},
	{ path: "/edit", component: [UserEdit], login: true},
	{ path: "/lobby", component: [Lobby, Navbar], login: true},
	{ path: "/local", component: [Local], login: true},
	{ path: "/tdata", component: [Tdata], login: true},
	{ path: "/room/:roomuuid", component: [Room], login: true},
	{ path: "/404", component: [NotFound], login: false},
];

const router = async () => {
	animateGame.setAnimateOff();

	const potentialMatches = routes.map(route => {
		return {
			route: route,
			result: location.pathname.match(pathToRegex(route.path)),
		};
	});

	const getParams = (match) => {
		if (!match.result)
			return;
		const values = match.result.slice(1);
		const keys = Array.from(match.route.path.matchAll(ROUTE_PARAMETER_REGEX)).map(
			(result) => result[1]
		);
		return Object.fromEntries(
			keys.map((key, i) => {
				return [key, values[i]];
			})
		);
	}

	let match = potentialMatches.find(potentialMatches => potentialMatches.result);
	if (!match) {
		match = {
			route: routes[routes.length - 1],
			result: undefined
		}
	}

	if (match.route.login === true) { // login 상태 확인
		const islogin = await loginModule.isLogin();
		if (islogin === false) {
			return ;
		}
	}

	const component = new match.route.component[0]();
	document.querySelector("#app").innerHTML = await component.getHtml();
	if (match.route.component[1]) {
		const navbar = new match.route.component[1]();
		if (navbar) {
			document.querySelector("#nav").innerHTML = await navbar.getHtml();
			navbar.handleRoute();
		}
	}
	else {
		document.querySelector("#nav").innerHTML = await ``;
	}
	component.handleRoute(getParams(match));
}

export const navigateTo = url => {
	history.pushState(null, null, url);
	router();
};

const pathToRegex = (path) => {
	return new RegExp('^' + path.replace(URL_FRAGMENT_REGEX, '\\/').replace(ROUTE_PARAMETER_REGEX, '(.+)') + '$');
}

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
	document.body.addEventListener("click", e => {
		if (e.target.dataset.href) {
			e.preventDefault();
			navigateTo(e.target.dataset.href);
		}
	});
});

const loginModule = new LoginModule();

router();